"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function FacturationPage() {

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

  const [client, setClient] =
    useState("SFR");

  useEffect(() => {

    const sauvegardeInterventions =
      localStorage.getItem("interventions");

    if (sauvegardeInterventions) {

      setInterventions(
        JSON.parse(sauvegardeInterventions)
      );

    }

    const sauvegardeDepenses =
      localStorage.getItem("depenses");

    if (sauvegardeDepenses) {

      setDepenses(
        JSON.parse(sauvegardeDepenses)
      );

    }

  }, []);

  const chiffreAffaire = interventions.reduce(
    (total, item) =>
      total +
      tarifs[item.type as keyof typeof tarifs],
    0
  );

  const totalFrais = depenses.reduce(
    (total, item) =>
      total + item.montant,
    0
  );

  const charges = Math.round(
    chiffreAffaire * 0.212
  );

  const benefice =
    chiffreAffaire -
    totalFrais -
    charges;

  const genererPDF = () => {

    const doc = new jsPDF();

    const date = new Date();

    const mois =
      date.toLocaleString("fr-FR", {
        month: "long",
      });

    const annee = date.getFullYear();

    const numeroFacture =
      `${annee}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    doc.setFillColor(245, 245, 245);

    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(24);

    doc.setTextColor(20, 20, 20);

    doc.text(
      "FACTURE",
      20,
      25
    );

    doc.setFontSize(12);

    doc.text(
      `Facture N° ${numeroFacture}`,
      150,
      20
    );

    doc.text(
      `Date : ${date.toLocaleDateString(
        "fr-FR"
      )}`,
      150,
      28
    );

    doc.setFontSize(14);

    doc.text(
      "PRESTATAIRE",
      20,
      55
    );

    doc.setFontSize(11);

    doc.text(
      "Sofiane DEMMANE",
      20,
      65
    );

    doc.text(
      "35 bis rue de songeons",
      20,
      72
    );

    doc.text(
      "60000 BEAUVAIS",
      20,
      79
    );

    doc.text(
      "Téléphone : 0755466036",
      20,
      90
    );

    doc.text(
      "Email : Sofiane.demmane-pro@outlook.fr",
      20,
      97
    );

    doc.text(
      "SIRET : 10451838600016",
      20,
      104
    );

    doc.setFontSize(14);

    doc.text(
      "CLIENT",
      130,
      55
    );

    doc.setFontSize(11);

    doc.text(
      client,
      130,
      65
    );

    doc.setFontSize(14);

    doc.text(
      "DESCRIPTION",
      20,
      130
    );

    doc.setDrawColor(220);

    doc.line(20, 135, 190, 135);

    doc.setFontSize(11);

    doc.text(
      `Prestations fibre optique - ${mois} ${annee}`,
      20,
      150
    );

    doc.text(
      "Montant HT",
      150,
      150
    );

    doc.setFontSize(13);

    doc.text(
      `${chiffreAffaire}€`,
      170,
      150
    );

    doc.line(20, 160, 190, 160);

    doc.setFontSize(12);

    doc.text(
      "Acompte",
      20,
      175
    );

    doc.text(
      "0€",
      170,
      175
    );

    doc.text(
      "Reste à payer",
      20,
      188
    );

    doc.setFontSize(16);

    doc.text(
      `${chiffreAffaire}€`,
      160,
      188
    );

    doc.setFontSize(10);

    doc.text(
      "TVA non applicable - article 293 B du CGI",
      20,
      230
    );

    doc.save(
      `facture-${numeroFacture}.pdf`
    );
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
        Facturation
      </h1>

      <p className="text-zinc-400 mb-10">
        Génération automatique des factures
      </p>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

        <h2 className="text-2xl font-bold mb-6">
          Informations client
        </h2>

        <input
          type="text"
          value={client}
          onChange={(e) =>
            setClient(e.target.value)
          }
          placeholder="Nom du client"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <p className="text-zinc-400 mb-2">
            Chiffre d'affaire HT
          </p>

          <h2 className="text-4xl font-bold text-green-400">
            {chiffreAffaire}€
          </h2>

        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <p className="text-zinc-400 mb-2">
            Charges estimées
          </p>

          <h2 className="text-4xl font-bold text-orange-400">
            {charges}€
          </h2>

        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <p className="text-zinc-400 mb-2">
            Bénéfice estimé
          </p>

          <h2 className="text-4xl font-bold text-cyan-400">
            {benefice}€
          </h2>

        </div>

      </div>

      <button
        onClick={genererPDF}
        className="w-full mt-8 bg-green-600 hover:bg-green-700 transition p-5 rounded-3xl text-2xl font-bold"
      >
        Générer la facture PDF
      </button>

    </div>
  );
}