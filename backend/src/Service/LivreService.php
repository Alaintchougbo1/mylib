<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CreateLivreDTO;
use App\DTO\LivreResponseDTO;
use App\DTO\UpdateLivreDTO;
use App\Entity\Livre;
use App\Repository\LivreRepository;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service gérant la logique métier liée aux livres.
 */
class LivreService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly LivreRepository $livreRepository
    ) {
    }

    /**
     * Récupère tous les livres avec filtres optionnels.
     *
     * @param array<string, mixed> $filters
     * @return LivreResponseDTO[]
     */
    public function getAllLivres(array $filters = []): array
    {
        $livres = $this->livreRepository->findWithFilters($filters);
        return LivreResponseDTO::fromEntities($livres);
    }

    /**
     * Récupère un livre par son ID.
     */
    public function getLivreById(int $id): ?LivreResponseDTO
    {
        $livre = $this->livreRepository->find($id);

        if (!$livre) {
            return null;
        }

        return LivreResponseDTO::fromEntity($livre);
    }

    /**
     * Crée un nouveau livre.
     */
    public function createLivre(CreateLivreDTO $createLivreDTO): LivreResponseDTO
    {
        $livre = new Livre();
        $livre->setTitre($createLivreDTO->titre);
        $livre->setAuteur($createLivreDTO->auteur);
        $livre->setIsbn($createLivreDTO->isbn);
        $livre->setDescription($createLivreDTO->description);
        $livre->setDisponible($createLivreDTO->disponible);

        $this->entityManager->persist($livre);
        $this->entityManager->flush();

        return LivreResponseDTO::fromEntity($livre);
    }

    /**
     * Met à jour un livre existant.
     */
    public function updateLivre(int $id, UpdateLivreDTO $updateLivreDTO): ?LivreResponseDTO
    {
        $livre = $this->livreRepository->find($id);

        if (!$livre) {
            return null;
        }

        if ($updateLivreDTO->titre !== null) {
            $livre->setTitre($updateLivreDTO->titre);
        }

        if ($updateLivreDTO->auteur !== null) {
            $livre->setAuteur($updateLivreDTO->auteur);
        }

        if ($updateLivreDTO->isbn !== null) {
            $livre->setIsbn($updateLivreDTO->isbn);
        }

        if ($updateLivreDTO->description !== null) {
            $livre->setDescription($updateLivreDTO->description);
        }

        if ($updateLivreDTO->disponible !== null) {
            $livre->setDisponible($updateLivreDTO->disponible);
        }

        $this->entityManager->flush();

        return LivreResponseDTO::fromEntity($livre);
    }

    /**
     * Supprime un livre.
     *
     * @throws \RuntimeException Si le livre ne peut pas être supprimé à cause de demandes associées
     */
    public function deleteLivre(int $id): bool
    {
        $livre = $this->livreRepository->find($id);

        if (!$livre) {
            return false;
        }

        try {
            $this->entityManager->remove($livre);
            $this->entityManager->flush();
            return true;
        } catch (ForeignKeyConstraintViolationException $e) {
            throw new \RuntimeException(
                'Impossible de supprimer ce livre car il est associé à des demandes d\'emprunt. ' .
                'Veuillez d\'abord supprimer les demandes ou mettre à jour la base de données.',
                0,
                $e
            );
        }
    }
}
