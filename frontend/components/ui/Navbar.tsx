'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-xl font-display font-bold text-text-primary">
              Bibliothèque
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/livres" className="navbar-link">
                  Livres
                </Link>
                <Link href="/demandes" className="navbar-link">
                  Mes demandes
                </Link>
                {user.role === 'ROLE_ADMIN' && (
                  <Link href="/admin" className="navbar-link">
                    Administration
                  </Link>
                )}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                  <Link href="/profil" className="flex items-center gap-2 navbar-link">
                    <User className="w-4 h-4" />
                    <span>{user.prenom}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-error hover:text-error/80 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-link">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t border-border bg-surface"
        >
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link href="/livres" className="block py-2 navbar-link">
                  Livres
                </Link>
                <Link href="/demandes" className="block py-2 navbar-link">
                  Mes demandes
                </Link>
                {user.role === 'ROLE_ADMIN' && (
                  <Link href="/admin" className="block py-2 navbar-link">
                    Administration
                  </Link>
                )}
                <Link href="/profil" className="block py-2 navbar-link">
                  Profil
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-error"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 navbar-link">
                  Connexion
                </Link>
                <Link href="/register" className="block py-2 navbar-link">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
