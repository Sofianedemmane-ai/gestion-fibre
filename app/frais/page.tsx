"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function FraisPage() {

  const [nom, setNom] =
    useState("");

  const [montant, setMontant] =
    useState("");

  const [date, setDate] =
    useState("");

  const [depenses, setDepenses] =
    useState<any[]>([]);

  useEffect(() => {

    chargerDepenses();

  }, []);

  const chargerDepenses = async () => {

    const { data, error } =
      await supabase
        .from("depenses")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {

      console.log(error);

      return;
    }

    setDepenses(data || []);
  };

  const ajouterDepense = async () => {

    if (!nom || !montant || !date)
      return;

    const nouvelleDepense = {
      nom,
      montant: Number(montant),
      date,
    };

    const { error } =
      await supabase
        .from("depenses")
        .insert([nouvelleDepense]);

    if (error) {

      console.log(error);

      alert("Erreur Supabase");

      return;
    }

    await chargerDepenses();

    setNom("");
    setMontant("");
    setDate("");

    alert("Frais ajouté !");
  };

  const supprimerDepense =
    async (id: number) => {

      const { error } =
        await supabase
          .from("depenses")
          .delete()
          .eq("id", id);

      if (error) {

        console.log(error);

        return;
      }

      await chargerDepenses();
    };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">

      <a
        href="/"
        className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 transition px-5 py-3 rounded-2xl"
      >
        ← Retour au tableau de bord
      </a>

      <h1 className="text-3xl md:text-5xl font-bold mb-2">
        Frais
      </h1>

      <p className="text-zinc-400 mb-10">
        Gestion des dépenses
      </p>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

        <h2 className="text-2xl font-bold mb-6">
          Ajouter un frais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Nom du frais"
            value={nom}
            onChange={(e) =>
              setNom(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <input
            type="number"
            placeholder="Montant"
            value={montant}
            onChange={(e) =>
              setMontant(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <input
            type="text"
            placeholder="Date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <button
            onClick={ajouterDepense}
            className="bg-green-600 hover:bg-green-700 transition rounded-2xl font-bold min-h-[56px]"
          >
            Ajouter
          </button>

        </div>

      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Historique des frais
        </h2>

        <div className="space-y-3">

          {depenses.map((item) => (

            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded-2xl flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  {item.nom}
                </p>

                <p className="text-sm text-zinc-400">
                  {item.date}
                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="text-red-400 font-bold text-xl">
                  -{item.montant}€
                </div>

                <button
                  onClick={() =>
                    supprimerDepense(item.id)
                  }
                  className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl"
                >
                  Supprimer
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}