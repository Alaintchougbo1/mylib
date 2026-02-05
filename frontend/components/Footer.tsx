'use client';

import Link from 'next/link';
import { Book, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-white py-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                <Book size={400} />
            </div>

            <div className="section-container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg">
                                <Book size={20} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                MyLib<span className="text-brand-500">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            La plateforme de référence pour la gestion de bibliothèques académiques et professionnelles. Conçue pour l'excellence et la rapidité.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <Twitter size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <Github size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <Linkedin size={18} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Navigation</h4>
                        <ul className="space-y-4">
                            {['Accueil', 'Catalogue', 'À propos', 'Blog', 'Contact'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-slate-500 hover:text-brand-400 transition-colors text-sm font-medium">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Légal</h4>
                        <ul className="space-y-4">
                            {['Confidentialité', 'Cookies', 'Mentions Légales', 'CGU'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-slate-500 hover:text-brand-400 transition-colors text-sm font-medium">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Recevez nos dernières mises à jour et les nouveautés du catalogue.
                        </p>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-500 transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-500 transition-all font-medium placeholder:text-slate-700"
                            />
                        </div>
                        <button className="w-full btn-primary py-3 bg-brand-600 hover:bg-brand-700 shadow-none text-xs uppercase tracking-widest">
                            S'abonner
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                    <p>© {currentYear} MyLib Platform. Tous droits réservés.</p>
                    <div className="flex items-center gap-8">
                        <span>Powered by Next.js 16</span>
                        <span>Made with Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
