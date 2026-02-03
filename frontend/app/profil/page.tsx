'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
            <div className="space-x-4">
              <Link href="/livres" className="text-blue-600 hover:underline">Catalogue</Link>
              <Link href="/demandes" className="text-blue-600 hover:underline">Mes Demandes</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations Personnelles</h2>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <p className="text-gray-800">{user.email}</p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
              <p className="text-gray-800">{user.prenom}</p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <p className="text-gray-800">{user.nom}</p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
              <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role === 'ROLE_ADMIN' ? 'Administrateur' : 'Usager'}
              </span>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Membre depuis</label>
              <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
