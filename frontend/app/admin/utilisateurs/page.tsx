'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AlertDialog from '@/components/ui/AlertDialog';
import api from '@/services/api';
import { User } from '@/types';

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'ROLE_USER',
  });
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; userId?: number }>({ isOpen: false });
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; message: string; variant: 'success' | 'error' }>({ isOpen: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUtilisateurs();
      setUsers(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.createUtilisateur(formData);
      setModalOpen(false);
      setFormData({ email: '', password: '', nom: '', prenom: '', role: 'ROLE_USER' });
      fetchUsers();
      setAlertDialog({ isOpen: true, message: 'Utilisateur créé avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors de la création', variant: 'error' });
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, userId: id });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.userId) return;
    try {
      await api.deleteUtilisateur(confirmDialog.userId);
      fetchUsers();
      setAlertDialog({ isOpen: true, message: 'Utilisateur supprimé avec succès', variant: 'success' });
    } catch (error) {
      setAlertDialog({ isOpen: true, message: 'Erreur lors de la suppression', variant: 'error' });
    }
  };

  const columns = [
    { key: 'prenom', header: 'Prénom' },
    { key: 'nom', header: 'Nom' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Rôle',
      render: (user: User) => (
        <Badge variant={user.role === 'ROLE_ADMIN' ? 'info' : 'success'}>
          {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold">Gestion des utilisateurs</h1>
        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          Ajouter un utilisateur
        </Button>
      </div>

        <Table
          data={users}
          columns={columns}
          actions={(user) => (
            <button
              onClick={() => handleDelete(user.id)}
              className="text-error hover:text-error/80"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Ajouter un utilisateur"
        >
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
              <Input
                label="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">Rôle</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ROLE_USER">Utilisateur</option>
                <option value="ROLE_ADMIN">Administrateur</option>
              </select>
            </div>
            <Button onClick={handleSubmit} variant="primary" className="w-full">
              Créer
            </Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false })}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
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
    </AdminLayout>
  );
}
