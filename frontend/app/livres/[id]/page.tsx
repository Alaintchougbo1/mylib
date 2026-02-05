'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/services/api';
import { Livre } from '@/types';

export default function LivreDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchLivre();
  }, [params.id]);

  const fetchLivre = async () => {
    try {
      const response = await api.get(`/livres/${params.id}`);
      setLivre(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await api.post('/demandes', { livreId: Number(params.id) });
      alert('Demande envoyée avec succès!');
      router.push('/demandes');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Erreur lors de la demande');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="container-page"><div className="skeleton h-96" /></div>;
  }

  if (!livre) {
    return <div className="container-page">Livre non trouvé</div>;
  }

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la liste
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BookOpen className="w-32 h-32 text-primary/30" />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                {livre.titre}
              </h1>
              <p className="text-xl text-text-secondary mb-4">par {livre.auteur}</p>
              {livre.disponible ? (
                <Badge variant="success">Disponible</Badge>
              ) : (
                <Badge variant="error">Indisponible</Badge>
              )}
            </div>

            {livre.description && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary leading-relaxed">{livre.description}</p>
              </div>
            )}

            {livre.isbn && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">ISBN</h3>
                <p className="font-mono text-text-secondary">{livre.isbn}</p>
              </div>
            )}

            <div className="pt-6">
              {livre.disponible ? (
                <Button
                  onClick={handleRequest}
                  isLoading={requesting}
                  variant="primary"
                  size="lg"
                >
                  Demander l'emprunt
                </Button>
              ) : (
                <Button variant="ghost" size="lg" disabled>
                  Livre indisponible
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
