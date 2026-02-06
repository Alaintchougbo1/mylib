'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen as BookIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from '@/components/ui/SearchBar';
import { BookCard } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/services/api';
import { Livre } from '@/types';

export default function LivresPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      const data = await api.getLivres();
      setLivres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLivres = livres.filter((livre) =>
    livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livre.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="container-page">
        <div className="grid-books">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-3 sm:mb-4">
            Catalogue de livres
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Découvrez notre collection et empruntez vos livres préférés
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={setSearchTerm}
          />
        </div>

        {filteredLivres.length === 0 ? (
          <EmptyState
            icon={<BookIcon className="w-24 h-24 text-text-muted" />}
            title="Aucun livre trouvé"
            description="Essayez de modifier vos critères de recherche"
          />
        ) : (
          <div className="grid-books">
            {filteredLivres.map((livre) => (
              <BookCard
                key={livre.id}
                title={livre.titre}
                author={livre.auteur}
                disponible={livre.disponible}
                onAction={() => router.push(`/livres/${livre.id}`)}
                actionLabel="Voir détails"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
