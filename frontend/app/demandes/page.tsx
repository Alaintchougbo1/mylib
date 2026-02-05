'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatusBadge } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/services/api';
import { Demande } from '@/types';

export default function DemandesPage() {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const response = await api.get('/demandes');
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container-page"><div className="skeleton h-64" /></div>;
  }

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold text-text-primary mb-8">
          Mes demandes
        </h1>

        {demandes.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-24 h-24" />}
            title="Aucune demande"
            description="Vous n'avez pas encore fait de demande d'emprunt"
          />
        ) : (
          <div className="space-y-4">
            {demandes.map((demande) => (
              <motion.div
                key={demande.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-text-primary mb-1">
                      {demande.livre.titre}
                    </h3>
                    <p className="text-text-secondary mb-2">par {demande.livre.auteur}</p>
                    <p className="text-sm text-text-muted">
                      Demandé le {new Date(demande.dateDemande).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={demande.statut} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
