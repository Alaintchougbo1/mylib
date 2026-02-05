'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/ui/Sidebar';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AlertDialog from '@/components/ui/AlertDialog';
import api from '@/services/api';
import { Livre } from '@/types';

export default function AdminLivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    isbn: '',
    description: '',
    disponible: true,
  });
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; livreId?: number }>({ isOpen: false });
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; message: string; variant: 'success' | 'error' }>({ isOpen: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      const data = await api.getLivres();
      setLivres(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingLivre) {
        await api.updateLivre(editingLivre.id, formData);
      } else {
        await api.createLivre(formData);
      }
      setModalOpen(false);
      resetForm();
      fetchLivres();
      setAlertDialog({ isOpen: true, message: 'Livre enregistré avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors de la sauvegarde', variant: 'error' });
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, livreId: id });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.livreId) return;
    try {
      await api.deleteLivre(confirmDialog.livreId);
      fetchLivres();
      setAlertDialog({ isOpen: true, message: 'Livre supprimé avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors de la suppression', variant: 'error' });
    }
  };

  const openEditModal = (livre: Livre) => {
    setEditingLivre(livre);
    setFormData({
      titre: livre.titre,
      auteur: livre.auteur,
      isbn: livre.isbn || '',
      description: livre.description || '',
      disponible: livre.disponible,
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingLivre(null);
    setFormData({ titre: '', auteur: '', isbn: '', description: '', disponible: true });
  };

  const columns = [
    { key: 'titre', header: 'Titre' },
    { key: 'auteur', header: 'Auteur' },
    { key: 'isbn', header: 'ISBN' },
    {
      key: 'disponible',
      header: 'Statut',
      render: (livre: Livre) => (
        <Badge variant={livre.disponible ? 'success' : 'error'}>
          {livre.disponible ? 'Disponible' : 'Indisponible'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 container-page">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">Gestion des livres</h1>
          <Button
            onClick={() => { resetForm(); setModalOpen(true); }}
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
          >
            Ajouter un livre
          </Button>
        </div>

        <Table
          data={livres}
          columns={columns}
          actions={(livre) => (
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(livre)}
                className="text-primary hover:text-primary-light"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(livre.id)}
                className="text-error hover:text-error/80"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); resetForm(); }}
          title={editingLivre ? 'Modifier le livre' : 'Ajouter un livre'}
        >
          <div className="space-y-4">
            <Input
              label="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
            />
            <Input
              label="Auteur"
              value={formData.auteur}
              onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              required
            />
            <Input
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
            <div>
              <label className="input-label">Description</label>
              <textarea
                className="input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4"
              />
              <label>Disponible</label>
            </div>
            <Button onClick={handleSubmit} variant="primary" className="w-full">
              {editingLivre ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false })}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible et supprimera également toutes les demandes associées."
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
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
