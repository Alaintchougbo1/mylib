<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Livre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository pour l'entité Livre.
 * Gère les requêtes liées aux livres.
 *
 * @extends ServiceEntityRepository<Livre>
 */
class LivreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Livre::class);
    }

    /**
     * Trouve les livres avec filtres optionnels.
     *
     * @param array<string, mixed> $filters
     * @return Livre[]
     */
    public function findWithFilters(array $filters = []): array
    {
        $qb = $this->createQueryBuilder('l');

        if (isset($filters['titre']) && !empty($filters['titre'])) {
            $qb->andWhere('l.titre LIKE :titre')
               ->setParameter('titre', '%' . $filters['titre'] . '%');
        }

        if (isset($filters['auteur']) && !empty($filters['auteur'])) {
            $qb->andWhere('l.auteur LIKE :auteur')
               ->setParameter('auteur', '%' . $filters['auteur'] . '%');
        }

        if (isset($filters['disponible'])) {
            $qb->andWhere('l.disponible = :disponible')
               ->setParameter('disponible', (bool) $filters['disponible']);
        }

        $qb->orderBy('l.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Compte le nombre total de livres.
     */
    public function countAll(): int
    {
        return $this->count([]);
    }

    /**
     * Compte le nombre de livres empruntés (non disponibles).
     */
    public function countEmpruntes(): int
    {
        return $this->count(['disponible' => false]);
    }

    /**
     * Trouve un livre par son ISBN.
     */
    public function findOneByIsbn(string $isbn): ?Livre
    {
        return $this->findOneBy(['isbn' => $isbn]);
    }
}
