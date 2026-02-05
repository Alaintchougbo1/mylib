'use client';

import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-display font-bold text-text-primary mb-8">
          Mon profil
        </h1>

        <div className="card">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-display font-bold text-primary">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold text-text-primary">
                {user.prenom} {user.nom}
              </h2>
              <p className="text-text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="text-text-primary font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm text-text-muted">Rôle</p>
                <p className="text-text-primary font-medium">
                  {user.role === 'ROLE_ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm text-text-muted">Membre depuis</p>
                <p className="text-text-primary font-medium">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
