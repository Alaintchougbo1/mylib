'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Demande } from '@/types';
import Link from 'next/link';

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const data = await api.getDemandes();
      setDemandes(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'approuvee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      case 'retournee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'approuvee': return 'Approuvée';
      case 'refusee': return 'Refusée';
      case 'retournee': return 'Retournée';
      default: return statut;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mes Demandes d'Emprunt</h1>
            <div className="space-x-4">
              <Link href="/livres" className="text-blue-600 hover:underline">Catalogue</Link>
              <Link href="/profil" className="text-blue-600 hover:underline">Mon Profil</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {demandes.map((demande) => (
            <div key={demande.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{demande.livre.titre}</h2>
                  <p className="text-gray-600 mb-2">Par {demande.livre.auteur}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Demandé le: {new Date(demande.dateDemande).toLocaleDateString('fr-FR')}</span>
                    {demande.dateRetour && (
                      <span>Retourné le: {new Date(demande.dateRetour).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                  {demande.commentaire && (
                    <p className="mt-2 text-gray-700 italic">Commentaire: {demande.commentaire}</p>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatutColor(demande.statut)}`}>
                  {getStatutLabel(demande.statut)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {demandes.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-4">Vous n'avez pas encore de demandes</p>
            <Link href="/livres" className="text-blue-600 hover:underline">
              Consulter le catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
