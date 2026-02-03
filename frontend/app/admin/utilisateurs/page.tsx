'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { User } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', nom: '', prenom: '', role: 'ROLE_USER' });
  const { logout } = useAuth();

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    const data = await api.getUtilisateurs();
    setUtilisateurs(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updateData: any = { email: formData.email, nom: formData.nom, prenom: formData.prenom, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        await api.updateUtilisateur(editingId, updateData);
      } else {
        await api.createUtilisateur(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ email: '', password: '', nom: '', prenom: '', role: 'ROLE_USER' });
      fetchUtilisateurs();
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ email: user.email, password: '', nom: user.nom, prenom: user.prenom, role: user.role });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      await api.deleteUtilisateur(id);
      fetchUtilisateurs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
            <div className="space-x-4">
              <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
              <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ email: '', password: '', nom: '', prenom: '', role: 'ROLE_USER' }); }} className="bg-green-600 text-white px-4 py-2 rounded">
                {showForm ? 'Annuler' : 'Nouvel Utilisateur'}
              </button>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Modifier' : 'Nouvel'} Utilisateur</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="px-4 py-2 border rounded" />
              <input type="password" placeholder={editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingId} className="px-4 py-2 border rounded" />
              <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required className="px-4 py-2 border rounded" />
              <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required className="px-4 py-2 border rounded" />
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="px-4 py-2 border rounded col-span-2">
                <option value="ROLE_USER">Usager</option>
                <option value="ROLE_ADMIN">Administrateur</option>
              </select>
              <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">Enregistrer</button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {utilisateurs.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.prenom} {user.nom}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Supprimer</button>
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
