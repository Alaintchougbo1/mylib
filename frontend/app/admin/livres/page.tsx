'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Livre } from '@/types';
import Link from 'next/link';

export default function AdminLivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ titre: '', auteur: '', isbn: '', description: '' });
  const { logout } = useAuth();

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    const data = await api.getLivres();
    setLivres(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateLivre(editingId, formData);
      } else {
        await api.createLivre(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ titre: '', auteur: '', isbn: '', description: '' });
      fetchLivres();
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (livre: Livre) => {
    setEditingId(livre.id);
    setFormData({ titre: livre.titre, auteur: livre.auteur, isbn: livre.isbn || '', description: livre.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce livre ?')) {
      await api.deleteLivre(id);
      fetchLivres();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestion des Livres</h1>
            <div className="space-x-4">
              <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
              <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ titre: '', auteur: '', isbn: '', description: '' }); }} className="bg-green-600 text-white px-4 py-2 rounded">
                {showForm ? 'Annuler' : 'Nouveau Livre'}
              </button>
              <button onClick={logout} className="text-red-600 hover:underline">Déconnexion</button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Modifier' : 'Nouveau'} Livre</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Titre" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} required className="px-4 py-2 border rounded" />
              <input type="text" placeholder="Auteur" value={formData.auteur} onChange={(e) => setFormData({...formData, auteur: e.target.value})} required className="px-4 py-2 border rounded" />
              <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="px-4 py-2 border rounded" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="px-4 py-2 border rounded col-span-2" />
              <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">Enregistrer</button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {livres.map((livre) => (
                <tr key={livre.id}>
                  <td className="px-6 py-4">{livre.titre}</td>
                  <td className="px-6 py-4">{livre.auteur}</td>
                  <td className="px-6 py-4">{livre.isbn || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${livre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {livre.disponible ? 'Disponible' : 'Emprunté'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(livre)} className="text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(livre.id)} className="text-red-600 hover:underline">Supprimer</button>
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
