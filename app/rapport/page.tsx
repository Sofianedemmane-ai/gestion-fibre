"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RapportPage() {

  const tarifs = {
    SAV: 10,
    PLP: 30,
    REFRAC: 45,
    "RACCORDEMENT PAVILLON": 100,
    "RACCORDEMENT APPARTEMENT": 45,
    "IP-ACCES": 110,
  };

  const [numero, setNumero] =
    useState("");

  const [type, setType] =
    useState("PLP");

  const [date, setDate] =
    useState("");

  const [heure, setHeure] =
    useState("");

  const [recherche, setRecherche] =
    useState("");

  const [modeEdition, setModeEdition] =
    useState(false);

  const [indexEdition, setIndexEdition] =
    useState<number | null>(null);

  const [interventions, setInterventions] =
    useState<any[]>([]);

  useEffect(() => {

    chargerInterventions();

  }, []);

  const chargerInterventions = async () => {

    const { data, error } =
      await supabase
        .from("interventions")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {

      console.log(error);

      return;
    }

    setInterventions(data || []);
  };

  const ajouterIntervention = async () => {

    if (!numero || !date || !heure) return;

    const nouvelleIntervention = {
      numero,
      type,
      date,
      heure,
    };

    if (
      modeEdition &&
      indexEdition !== null
    ) {

      const interventionAModifier =
        interventions[indexEdition];

      const { error } =
        await supabase
          .from("interventions")
          .update(nouvelleIntervention)
          .eq(
            "id",
            interventionAModifier.id
          );

      if (error) {

        console.log(error);

        alert("Erreur modification");

        return;
      }

    } else {

      const { error } =
        await supabase
          .from("interventions")
          .insert([nouvelleIntervention]);

      if (error) {

        console.log(error);

        alert("Erreur Supabase");

        return;
      }

    }

    await chargerInterventions();

    setNumero("");
    setDate("");
    setHeure("");

    setModeEdition(false);

    setIndexEdition(null);

    alert("Intervention enregistrée !");
  };

  const supprimerIntervention =
    async (indexASupprimer: number) => {

      const intervention =
        interventions[indexASupprimer];

      const { error } =
        await supabase
          .from("interventions")
          .delete()
          .eq("id", intervention.id);

      if (error) {

        console.log(error);

        return;
      }

      await chargerInterventions();
    };

  const modifierIntervention = (
    item: any,
    index: number
  ) => {

    setNumero(item.numero);

    setType(item.type);

    setDate(item.date);

    setHeure(item.heure);

    setModeEdition(true);

    setIndexEdition(index);
  };

  const interventionsFiltrees =
    interventions.filter((item) =>
      item.numero.includes(recherche)
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">

      <a
        href="/"
        className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 transition px-5 py-3 rounded-2xl"
      >
        ← Retour au tableau de bord
      </a>

      <h1 className="text-3xl md:text-5xl font-bold mb-2">
        Rapport d'intervention
      </h1>

      <p className="text-zinc-400 mb-10">
        Ajouter et gérer les interventions
      </p>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

        <h2 className="text-2xl font-bold mb-6">
          Ajouter une intervention
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <input
            type="text"
            placeholder="Numéro intervention"
            value={numero}
            onChange={(e) =>
              setNumero(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          >

            {Object.keys(tarifs).map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

          <input
            type="text"
            placeholder="Date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <input
            type="text"
            placeholder="Heure"
            value={heure}
            onChange={(e) =>
              setHeure(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <button
            onClick={ajouterIntervention}
            className="bg-green-600 hover:bg-green-700 transition rounded-2xl font-bold min-h-[56px]"
          >
            {
              modeEdition
                ? "Enregistrer"
                : "Ajouter"
            }
          </button>

        </div>

      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Historique des interventions
        </h2>

        <input
          type="text"
          placeholder="Rechercher un numéro intervention"
          value={recherche}
          onChange={(e) =>
            setRecherche(e.target.value)
          }
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none mb-6"
        />

        <div className="space-y-3">

          {interventionsFiltrees.map(
            (item, index) => (

              <div
                key={index}
                className="bg-zinc-800 p-4 rounded-2xl flex justify-between items-center"
              >

                <div>

                  <p className="font-semibold">
                    {item.type}
                  </p>

                  <p className="text-sm text-zinc-400">
                    #{item.numero} • {item.date} • {item.heure}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <div className="text-green-400 font-bold text-xl">

                    +{
                      tarifs[
                        item.type as keyof typeof tarifs
                      ]
                    }€

                  </div>

                  <button
                    onClick={() =>
                      modifierIntervention(
                        item,
                        index
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() =>
                      supprimerIntervention(
                        index
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl"
                  >
                    Supprimer
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}