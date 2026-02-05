'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import Sidebar from '@/components/ui/Sidebar';
import Table from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import AlertDialog from '@/components/ui/AlertDialog';
import api from '@/services/api';
import { Demande } from '@/types';

export default function AdminDemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; message: string; variant: 'success' | 'error' }>({ isOpen: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const data = await api.getDemandes();
      setDemandes(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.updateDemande(id, { statut: 'approuvee' });
      fetchDemandes();
      setAlertDialog({ isOpen: true, message: 'Demande approuvée avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors de l\'approbation', variant: 'error' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.updateDemande(id, { statut: 'refusee' });
      fetchDemandes();
      setAlertDialog({ isOpen: true, message: 'Demande refusée avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors du refus', variant: 'error' });
    }
  };

  const handleReturn = async (id: number) => {
    try {
      await api.updateDemande(id, { statut: 'retournee' });
      fetchDemandes();
      setAlertDialog({ isOpen: true, message: 'Livre marqué comme retourné', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors du retour', variant: 'error' });
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'Utilisateur',
      render: (d: Demande) => `${d.user.prenom} ${d.user.nom}`,
    },
    {
      key: 'livre',
      header: 'Livre',
      render: (d: Demande) => d.livre.titre,
    },
    {
      key: 'dateDemande',
      header: 'Date',
      render: (d: Demande) => new Date(d.dateDemande).toLocaleDateString('fr-FR'),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (d: Demande) => <StatusBadge status={d.statut} />,
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 container-page">
        <h1 className="text-4xl font-display font-bold mb-8">Gestion des demandes</h1>

        <Table
          data={demandes}
          columns={columns}
          actions={(demande) => (
            <div className="flex gap-2">
              {demande.statut === 'en_attente' && (
                <>
                  <button
                    onClick={() => handleApprove(demande.id)}
                    className="text-success hover:text-success/80"
                    title="Approuver"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(demande.id)}
                    className="text-error hover:text-error/80"
                    title="Refuser"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
              {demande.statut === 'approuvee' && (
                <button
                  onClick={() => handleReturn(demande.id)}
                  className="text-info hover:text-info/80 text-sm"
                >
                  Marquer retourné
                </button>
              )}
            </div>
          )}
        />

        <AlertDialog
          isOpen={alertDialog.isOpen}
          onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
          message={alertDialog.message}
          variant={alertDialog.variant}
        />
      </div>
    </div>
  );
}
