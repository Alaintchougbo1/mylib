import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async register(data: { email: string; password: string; nom: string; prenom: string }) {
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async getMe() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  async getLivres(filters?: { titre?: string; auteur?: string; disponible?: boolean }) {
    const response = await this.api.get('/livres', { params: filters });
    return response.data;
  }

  async getLivre(id: number) {
    const response = await this.api.get(`/livres/${id}`);
    return response.data;
  }

  async createLivre(data: { titre: string; auteur: string; isbn?: string; description?: string }) {
    const response = await this.api.post('/livres', data);
    return response.data;
  }

  async updateLivre(id: number, data: Partial<{ titre: string; auteur: string; isbn: string; description: string; disponible: boolean }>) {
    const response = await this.api.put(`/livres/${id}`, data);
    return response.data;
  }

  async deleteLivre(id: number) {
    return this.api.delete(`/livres/${id}`);
  }

  async getDemandes() {
    const response = await this.api.get('/demandes');
    return response.data;
  }

  async createDemande(livreId: number) {
    const response = await this.api.post('/demandes', { livreId });
    return response.data;
  }

  async updateDemande(id: number, data: { statut?: string; commentaire?: string }) {
    const response = await this.api.put(`/demandes/${id}`, data);
    return response.data;
  }

  async deleteDemande(id: number) {
    return this.api.delete(`/demandes/${id}`);
  }

  async getUtilisateurs() {
    const response = await this.api.get('/utilisateurs');
    return response.data;
  }

  async createUtilisateur(data: { email: string; password: string; nom: string; prenom: string; role: string }) {
    const response = await this.api.post('/utilisateurs', data);
    return response.data;
  }

  async updateUtilisateur(id: number, data: Partial<{ email: string; password: string; nom: string; prenom: string; role: string }>) {
    const response = await this.api.put(`/utilisateurs/${id}`, data);
    return response.data;
  }

  async deleteUtilisateur(id: number) {
    return this.api.delete(`/utilisateurs/${id}`);
  }

  async getStatistiques() {
    const response = await this.api.get('/statistiques');
    return response.data;
  }
}

export default new ApiService();
