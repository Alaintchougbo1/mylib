'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Identifiants incorrects');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-light to-accent p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white text-center space-y-6"
        >
          <BookOpen className="w-32 h-32 mx-auto" strokeWidth={1} />
          <h2 className="text-4xl font-display font-bold">
            Bienvenue dans votre bibliothèque
          </h2>
          <p className="text-xl opacity-90 max-w-md">
            Accédez à des milliers de livres et gérez vos emprunts en toute simplicité
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
              Connexion
            </h1>
            <p className="text-text-secondary">
              Entrez vos identifiants pour accéder à votre compte
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
            <Input
              type="email"
              label="Adresse email"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            <Input
              type="password"
              label="Mot de passe"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              Se connecter
            </Button>
          </form>

          <div className="text-center text-text-secondary">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary hover:text-primary-light font-semibold transition-colors">
              Créer un compte
            </Link>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-text-muted text-center">
              Comptes de test :<br />
              <span className="font-mono text-xs">admin@library.com / admin123456</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
