'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Livre } from '@/types';
import Link from 'next/link';

export default function LivreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLivre = async () => {
      try {
        const data = await api.getLivre(parseInt(resolvedParams.id));
        setLivre(data);
        setLoading(false);
      } catch (err) {
        alert('Livre non trouvé');
        router.push('/livres');
      }
    };
    fetchLivre();
  }, [resolvedParams.id, router]);

  const handleDemande = async () => {
    if (!livre) return;
    if (confirm('Voulez-vous demander ce livre ?')) {
      try {
        await api.createDemande(livre.id);
        alert('Demande créée avec succès !');
        router.push('/demandes');
      } catch (err) {
        alert('Erreur lors de la création de la demande');
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!livre) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/livres" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Retour à la liste
        </Link>

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{livre.titre}</h1>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700">Auteur:</span>
              <span className="ml-2 text-gray-600">{livre.auteur}</span>
            </div>

            {livre.isbn && (
              <div>
                <span className="font-semibold text-gray-700">ISBN:</span>
                <span className="ml-2 text-gray-600">{livre.isbn}</span>
              </div>
            )}

            <div>
              <span className="font-semibold text-gray-700">Statut:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${livre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {livre.disponible ? 'Disponible' : 'Emprunté'}
              </span>
            </div>

            {livre.description && (
              <div>
                <span className="font-semibold text-gray-700 block mb-2">Description:</span>
                <p className="text-gray-600 whitespace-pre-wrap">{livre.description}</p>
              </div>
            )}

            {livre.disponible && (
              <button
                onClick={handleDemande}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mt-4"
              >
                Demander ce livre
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
