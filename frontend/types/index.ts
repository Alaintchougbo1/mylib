export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
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
  statut: 'en_attente' | 'approuvee' | 'refusee' | 'retournee';
  dateDemande: string;
  dateRetour: string | null;
  commentaire: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LivreFilters {
  titre?: string;
  auteur?: string;
  disponible?: boolean;
}

export interface CreateLivreData {
  titre: string;
  auteur: string;
  isbn?: string;
  description?: string;
  disponible?: boolean;
}

export interface UpdateLivreData extends Partial<CreateLivreData> {}

export interface CreateDemandeData {
  livreId: number;
}

export interface UpdateDemandeData {
  statut?: 'en_attente' | 'approuvee' | 'refusee' | 'retournee';
  commentaire?: string;
  dateRetour?: string;
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
