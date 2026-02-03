'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Livre } from '@/types';
import Link from 'next/link';

export default function LivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [disponible, setDisponible] = useState<string>('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      const filters: { titre?: string; auteur?: string; disponible?: boolean } = {};
      if (titre) filters.titre = titre;
      if (auteur) filters.auteur = auteur;
      if (disponible) filters.disponible = disponible === 'true';

      const data = await api.getLivres(filters);
      setLivres(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDemande = async (livreId: number) => {
    if (confirm('Voulez-vous demander ce livre ?')) {
      try {
        await api.createDemande(livreId);
        alert('Demande créée avec succès !');
        fetchLivres();
      } catch (err) {
        alert('Erreur lors de la création de la demande');
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Catalogue de Livres</h1>
            <div className="space-x-4">
              <Link href="/demandes" className="text-blue-600 hover:underline">Mes Demandes</Link>
              <Link href="/profil" className="text-blue-600 hover:underline">Mon Profil</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Rechercher par auteur..."
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <select
                value={disponible}
                onChange={(e) => setDisponible(e.target.value)}
                className="px-4 py-2 border rounded-lg flex-1"
              >
                <option value="">Tous</option>
                <option value="true">Disponibles</option>
                <option value="false">Empruntés</option>
              </select>
              <button
                onClick={fetchLivres}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livres.map((livre) => (
            <div key={livre.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{livre.titre}</h2>
              <p className="text-gray-600 mb-2">Par {livre.auteur}</p>
              {livre.isbn && <p className="text-sm text-gray-500 mb-2">ISBN: {livre.isbn}</p>}
              {livre.description && (
                <p className="text-gray-700 mb-4 line-clamp-3">{livre.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${livre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {livre.disponible ? 'Disponible' : 'Emprunté'}
                </span>
                <div className="space-x-2">
                  <Link
                    href={`/livres/${livre.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Détails
                  </Link>
                  {livre.disponible && user?.role !== 'ROLE_ADMIN' && (
                    <button
                      onClick={() => handleDemande(livre.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Demander
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {livres.length === 0 && (
          <div className="text-center text-gray-500 mt-8">Aucun livre trouvé</div>
        )}
      </div>
    </div>
  );
}
