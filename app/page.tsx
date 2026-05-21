"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {

  const tarifs = {
    SAV: 10,
    PLP: 30,
    REFRAC: 45,
    "RACCORDEMENT PAVILLON": 100,
    "RACCORDEMENT APPARTEMENT": 45,
    "IP-ACCES": 110,
  };

  const [interventions, setInterventions] =
    useState<any[]>([]);

  const [depenses, setDepenses] =
    useState<any[]>([]);

  useEffect(() => {

    chargerInterventions();

    chargerDepenses();

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

  const chiffreAffaire = interventions.reduce(
    (total, item) =>
      total +
      tarifs[item.type as keyof typeof tarifs],
    0
  );

  const totalDepenses = depenses.reduce(
    (total, item) =>
      total + item.montant,
    0
  );

  const charges = Math.round(
    chiffreAffaire * 0.212
  );

  const beneficeBrut =
    chiffreAffaire - totalDepenses;

  const beneficeReel =
    chiffreAffaire -
    totalDepenses -
    charges;

  const objectif = 6500;

  const progression = Math.round(
    (chiffreAffaire / objectif) * 100
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="flex flex-col md:flex-row">

        <aside className="w-full md:w-72 md:min-h-screen bg-zinc-900 border-r border-zinc-800 p-6">

          <h1 className="text-3xl font-bold mb-10">
            Intervention Pro
          </h1>

          <nav className="space-y-3 md:space-y-3 flex md:block gap-3 overflow-x-auto">

            <a
              href="/"
              className="block bg-blue-600 p-4 rounded-2xl whitespace-nowrap"
            >
              Tableau de bord
            </a>

            <a
              href="/rapport"
              className="block bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-2xl whitespace-nowrap"
            >
              Rapport d'intervention
            </a>

            <a
              href="/frais"
              className="block bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-2xl whitespace-nowrap"
            >
              Frais
            </a>

            <a
              href="/facturation"
              className="block bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-2xl whitespace-nowrap"
            >
              Facturation
            </a>

          </nav>

        </aside>

        <main className="flex-1 p-4 md:p-8">

          <h2 className="text-3xl md:text-5xl font-bold mb-2">
            Tableau de bord
          </h2>

          <p className="text-zinc-400 mb-8">
            Vue globale de votre activité
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

              <p className="text-zinc-400 mb-2">
                C.A Cumulé
              </p>

              <h2 className="text-4xl font-bold text-green-400">
                {chiffreAffaire}€
              </h2>

              <div className="w-full bg-zinc-800 rounded-full h-3 mt-4">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${progression}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {progression}% de l'objectif
              </p>

            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

              <p className="text-zinc-400 mb-2">
                Bénéfice Brut
              </p>

              <h2 className="text-4xl font-bold text-blue-400">
                {beneficeBrut}€
              </h2>

            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

              <p className="text-zinc-400 mb-2">
                Interventions
              </p>

              <h2 className="text-4xl font-bold text-purple-400">
                {interventions.length}
              </h2>

            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

              <p className="text-zinc-400 mb-2">
                Objectif
              </p>

              <h2 className="text-4xl font-bold text-cyan-400">
                6500€
              </h2>

            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mt-8">

            <h2 className="text-2xl font-bold mb-6">
              Bilan Mensuel
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-zinc-800 p-4 rounded-2xl">

                <p className="text-zinc-400 mb-2">
                  Charges URSSAF
                </p>

                <p className="text-orange-400 text-2xl font-bold">
                  {charges}€
                </p>

              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">

                <p className="text-zinc-400 mb-2">
                  Total Frais
                </p>

                <p className="text-red-400 text-2xl font-bold">
                  {totalDepenses}€
                </p>

              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">

                <p className="text-zinc-400 mb-2">
                  Bénéfice Réel
                </p>

                <p className="text-green-400 text-2xl font-bold">
                  {beneficeReel}€
                </p>

              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">

                <p className="text-zinc-400 mb-2">
                  Objectif restant
                </p>

                <p className="text-blue-400 text-2xl font-bold">
                  {objectif - chiffreAffaire}€
                </p>

              </div>

            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mt-8">

            <h2 className="text-2xl font-bold mb-6">
              Répartition des interventions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div className="bg-zinc-800 p-4 rounded-2xl">
                SAV : {
                  interventions.filter(
                    (i) => i.type === "SAV"
                  ).length
                }
              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">
                PLP : {
                  interventions.filter(
                    (i) => i.type === "PLP"
                  ).length
                }
              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">
                REFRAC : {
                  interventions.filter(
                    (i) => i.type === "REFRAC"
                  ).length
                }
              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">
                Pavillon : {
                  interventions.filter(
                    (i) =>
                      i.type ===
                      "RACCORDEMENT PAVILLON"
                  ).length
                }
              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">
                Appartement : {
                  interventions.filter(
                    (i) =>
                      i.type ===
                      "RACCORDEMENT APPARTEMENT"
                  ).length
                }
              </div>

              <div className="bg-zinc-800 p-4 rounded-2xl">
                IP-ACCES : {
                  interventions.filter(
                    (i) =>
                      i.type === "IP-ACCES"
                  ).length
                }
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}