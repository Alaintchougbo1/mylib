'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Bibliothèque en Ligne
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Consultez notre catalogue de livres et faites vos demandes d'emprunt
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Se Connecter
          </Link>
          <Link
            href="/register"
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
