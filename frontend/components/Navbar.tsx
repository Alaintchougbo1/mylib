'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  Book,
  User,
  ClipboardList,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const navLinks = user ? [
    {
      label: isAdmin ? "Dashboard" : "Catalogue",
      href: isAdmin ? "/admin" : "/livres",
      icon: isAdmin ? <LayoutDashboard size={16} /> : <Book size={16} />
    },
    {
      label: "Demandes",
      href: isAdmin ? "/admin/demandes" : "/demandes",
      icon: <ClipboardList size={16} />
    }
  ] : [
    { label: "Accueil", href: "/", icon: null },
    { label: "Catalogue public", href: "/livres", icon: null },
    { label: "À propos", href: "#features", icon: null }
  ];

  return (
    <>
      <nav className="glass-header sticky top-0 z-[100]">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-10">
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Book size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-950">
                  MyLib<span className="text-brand-600">.</span>
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:text-slate-950 hover:bg-slate-50"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Auth/User Menu */}
            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <Link
                    href="/profil"
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white pl-1.5 pr-4 py-1.5 transition-all hover:border-brand-200 hover:bg-slate-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-600">
                      {user.prenom.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-950 tracking-tight">{user.prenom}</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                    title="Déconnexion"
                  >
                    <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
                    Connexion
                  </Link>
                  <Link href="/register" className="btn-primary py-2.5 px-6 text-xs uppercase tracking-widest shadow-none">
                    Rejoindre
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-950 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-[90] border-b border-slate-200 bg-white p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-900 active:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    {link.label}
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              ))}

              <div className="h-[1px] w-full bg-slate-100 my-2" />

              {user ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-black">
                      {user.prenom.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-950">{user.prenom}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? "Administrateur" : "Membre"}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 font-bold text-slate-900"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white shadow-xl shadow-slate-200"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
