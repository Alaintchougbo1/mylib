export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn: string | null;
  description: string | null;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Demande {
  id: number;
  user: User;
  livre: Livre;
  statut: string;
  dateDemande: string;
  dateRetour: string | null;
  commentaire: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Statistiques {
  total_livres: number;
  livres_empruntes: number;
  livres_disponibles: number;
  total_utilisateurs: number;
  total_demandes: number;
  demandes_en_attente: number;
  demandes_approuvees: number;
  demandes_refusees: number;
}
