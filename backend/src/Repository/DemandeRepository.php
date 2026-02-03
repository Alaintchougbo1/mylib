<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Demande;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository pour l'entité Demande.
 * Gère les requêtes liées aux demandes d'emprunt.
 *
 * @extends ServiceEntityRepository<Demande>
 */
class DemandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Demande::class);
    }

    /**
     * Récupère toutes les demandes d'un utilisateur.
     *
     * @return Demande[]
     */
    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.user = :user')
            ->setParameter('user', $user)
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Compte le nombre total de demandes.
     */
    public function countAll(): int
    {
        return $this->count([]);
    }

    /**
     * Compte le nombre de demandes en attente.
     */
    public function countEnAttente(): int
    {
        return $this->count(['statut' => Demande::STATUT_EN_ATTENTE]);
    }

    /**
     * Compte le nombre de demandes approuvées.
     */
    public function countApprouvees(): int
    {
        return $this->count(['statut' => Demande::STATUT_APPROUVEE]);
    }

    /**
     * Compte le nombre de demandes refusées.
     */
    public function countRefusees(): int
    {
        return $this->count(['statut' => Demande::STATUT_REFUSEE]);
    }
}
