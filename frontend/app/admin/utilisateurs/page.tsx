'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/ui/Sidebar';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/utilisateurs');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/utilisateurs', formData);
      setModalOpen(false);
      setFormData({ email: '', password: '', nom: '', prenom: '', role: 'ROLE_USER' });
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await api.delete(`/utilisateurs/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Erreur');
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 container-page">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">Gestion des utilisateurs</h1>
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
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
      </div>
    </div>
  );
}
