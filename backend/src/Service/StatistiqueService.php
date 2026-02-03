<?php

declare(strict_types=1);

namespace App\Service;

use App\Repository\DemandeRepository;
use App\Repository\LivreRepository;
use App\Repository\UserRepository;

/**
 * Service gérant la récupération des statistiques de la bibliothèque.
 */
class StatistiqueService
{
    public function __construct(
        private readonly LivreRepository $livreRepository,
        private readonly UserRepository $userRepository,
        private readonly DemandeRepository $demandeRepository
    ) {
    }

    /**
     * Récupère toutes les statistiques de la bibliothèque.
     *
     * @return array<string, int>
     */
    public function getStatistiques(): array
    {
        return [
            'total_livres' => $this->livreRepository->countAll(),
            'livres_empruntes' => $this->livreRepository->countEmpruntes(),
            'livres_disponibles' => $this->livreRepository->countAll() - $this->livreRepository->countEmpruntes(),
            'total_utilisateurs' => $this->userRepository->countAll(),
            'total_demandes' => $this->demandeRepository->countAll(),
            'demandes_en_attente' => $this->demandeRepository->countEnAttente(),
            'demandes_approuvees' => $this->demandeRepository->countApprouvees(),
            'demandes_refusees' => $this->demandeRepository->countRefusees(),
        ];
    }
}
