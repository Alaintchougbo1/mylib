'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-gradient" />
        <div className="container-section relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl lg:text-7xl font-display font-bold text-text-primary leading-tight"
              >
                Votre Bibliothèque{' '}
                <span className="text-primary">en Ligne</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-text-secondary leading-relaxed"
              >
                Explorez, empruntez et gérez vos livres préférés en toute simplicité.
                Une expérience de lecture moderne et intuitive.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/register">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Commencer
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="lg"className='cursor-pointer'>
                    Se connecter
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-8 flex items-center justify-center">
                <BookOpen className="w-64 h-64 text-primary/30" strokeWidth={1} />
                <div className="absolute inset-0 bg-noise rounded-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-text-primary mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Une plateforme moderne pour une gestion optimale de votre bibliothèque
          </p>
        </motion.div>

        <div className="grid-features">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="card text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 py-20">
        <div className="container-section">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="card bg-gradient-to-br from-primary to-primary-dark text-white text-center p-12 lg:p-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez notre communauté de lecteurs passionnés dès aujourd'hui.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" className='cursor-pointer'>
              Créer mon compte gratuitement
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-12 mt-20">
        <div className="container-section">
          <div className="text-center text-text-muted">
            <p>© 2026 Bibliothèque. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: BookOpen,
    title: 'Catalogue Complet',
    description: 'Accédez à une large collection de livres classés par genre et auteur.',
  },
  {
    icon: Clock,
    title: 'Emprunts Faciles',
    description: 'Réservez vos livres en quelques clics et suivez vos emprunts en temps réel.',
  },
  {
    icon: Users,
    title: 'Gestion Centralisée',
    description: 'Interface d\'administration complète pour gérer utilisateurs et emprunts.',
  },
];

const stats = [
  { value: '500+', label: 'Livres' },
  { value: '150+', label: 'Utilisateurs' },
  { value: '1200+', label: 'Emprunts' },
  { value: '98%', label: 'Satisfaction' },
];
