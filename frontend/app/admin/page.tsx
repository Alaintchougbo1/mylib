'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Statistiques } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ROLE_ADMIN') {
      router.push('/livres');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await api.getStatistiques();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrateur</h1>
            <div className="space-x-4">
              <Link href="/admin/livres" className="text-blue-600 hover:underline">Livres</Link>
              <Link href="/admin/utilisateurs" className="text-blue-600 hover:underline">Utilisateurs</Link>
              <Link href="/admin/demandes" className="text-blue-600 hover:underline">Demandes</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Livres</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_livres}</p>
              <p className="text-sm text-gray-600 mt-2">Disponibles: {stats.livres_disponibles}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Livres Empruntés</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.livres_empruntes}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Utilisateurs</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.total_utilisateurs}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Demandes</h3>
              <p className="text-3xl font-bold text-green-600">{stats.total_demandes}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">En Attente</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.demandes_en_attente}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Approuvées</h3>
              <p className="text-3xl font-bold text-green-600">{stats.demandes_approuvees}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-gray-500 text-sm font-semibold mb-2">Refusées</h3>
              <p className="text-3xl font-bold text-red-600">{stats.demandes_refusees}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
