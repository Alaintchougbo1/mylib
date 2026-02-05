'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, BookOpen } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
              Inscription
            </h1>
            <p className="text-text-secondary">
              Créez votre compte pour commencer
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Jean"
                required
              />
              <Input
                type="text"
                label="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Dupont"
                required
              />
            </div>

            <Input
              type="email"
              label="Adresse email"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.com"
              required
            />

            <Input
              type="password"
              label="Mot de passe"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              Créer mon compte
            </Button>
          </form>

          <div className="text-center text-text-secondary">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
              Se connecter
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-primary-light to-primary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white text-center space-y-6"
        >
          <BookOpen className="w-32 h-32 mx-auto" strokeWidth={1} />
          <h2 className="text-4xl font-display font-bold">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl opacity-90 max-w-md">
            Découvrez des milliers de livres et partagez votre passion pour la lecture
          </p>
        </motion.div>
      </div>
    </div>
  );
}
