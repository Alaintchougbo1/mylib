'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/layouts/AdminLayout';
import api from '@/services/api';
import { Statistiques } from '@/types';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) return;
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStatistiques();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="skeleton h-64" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-6 sm:mb-8">
          Dashboard Administration
        </h1>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <StatsCard
              icon={BookOpen}
              label="Total Livres"
              value={stats.total_livres}
              color="primary"
            />
            <StatsCard
              icon={Users}
              label="Utilisateurs"
              value={stats.total_utilisateurs}
              color="accent"
            />
            <StatsCard
              icon={FileText}
              label="Demandes"
              value={stats.total_demandes}
              color="info"
            />
            <StatsCard
              icon={TrendingUp}
              label="En attente"
              value={stats.demandes_en_attente}
              color="warning"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="card">
            <h3 className="text-lg sm:text-xl font-display font-semibold mb-4">Livres disponibles</h3>
            <div className="text-3xl sm:text-4xl font-bold text-success">
              {stats?.livres_disponibles || 0}
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg sm:text-xl font-display font-semibold mb-4">Demandes approuvées</h3>
            <div className="text-3xl sm:text-4xl font-bold text-primary">
              {stats?.demandes_approuvees || 0}
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

function StatsCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 text-${color}`} />
      </div>
      <div className="text-3xl font-display font-bold text-text-primary mb-1">
        {value}
      </div>
      <div className="text-text-secondary text-sm">{label}</div>
    </motion.div>
  );
}
