"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const connexion = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    window.location.href = "/";
  };

  const inscription = async () => {

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert("Compte créé !");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-2">
            TEST AUTH
        </h1>

        <p className="text-zinc-400 mb-8">
          Accès sécurisé à votre dashboard
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 outline-none"
          />

          <button
            onClick={connexion}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-2xl font-bold"
          >
            Se connecter
          </button>

          <button
            onClick={inscription}
            className="w-full bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-2xl font-bold"
          >
            Créer un compte
          </button>

        </div>

      </div>

    </div>
  );
}