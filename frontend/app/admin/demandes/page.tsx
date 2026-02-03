'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Demande } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminDemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    const data = await api.getDemandes();
    setDemandes(data);
  };

  const handleChangeStatut = async (id: number, statut: string) => {
    try {
      await api.updateDemande(id, { statut });
      fetchDemandes();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette demande ?')) {
      await api.deleteDemande(id);
      fetchDemandes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestion des Demandes</h1>
            <div className="space-x-4">
              <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {demandes.map((demande) => (
                <tr key={demande.id}>
                  <td className="px-6 py-4">{demande.user.prenom} {demande.user.nom}</td>
                  <td className="px-6 py-4">{demande.livre.titre}</td>
                  <td className="px-6 py-4">{new Date(demande.dateDemande).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <select
                      value={demande.statut}
                      onChange={(e) => handleChangeStatut(demande.id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="approuvee">Approuvée</option>
                      <option value="refusee">Refusée</option>
                      <option value="retournee">Retournée</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(demande.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
