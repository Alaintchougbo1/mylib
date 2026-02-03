<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CreateDemandeDTO;
use App\DTO\DemandeResponseDTO;
use App\DTO\UpdateDemandeDTO;
use App\Entity\Demande;
use App\Entity\User;
use App\Exception\LivreNotAvailableException;
use App\Exception\LivreNotFoundException;
use App\Repository\DemandeRepository;
use App\Repository\LivreRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service gérant la logique métier liée aux demandes d'emprunt.
 */
class DemandeService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly DemandeRepository $demandeRepository,
        private readonly LivreRepository $livreRepository
    ) {
    }

    /**
     * Récupère toutes les demandes (pour admin) ou les demandes de l'utilisateur (pour user).
     *
     * @return DemandeResponseDTO[]
     */
    public function getAllDemandes(?User $user = null, bool $isAdmin = false): array
    {
        if ($isAdmin) {
            $demandes = $this->demandeRepository->findAll();
        } else {
            $demandes = $this->demandeRepository->findByUser($user);
        }

        return DemandeResponseDTO::fromEntities($demandes);
    }

    /**
     * Récupère une demande par son ID.
     * Vérifie que l'utilisateur a le droit de voir cette demande.
     */
    public function getDemandeById(int $id, ?User $user = null, bool $isAdmin = false): ?DemandeResponseDTO
    {
        $demande = $this->demandeRepository->find($id);

        if (!$demande) {
            return null;
        }

        // Si ce n'est pas un admin, vérifier que la demande appartient à l'utilisateur
        if (!$isAdmin && $demande->getUser()->getId() !== $user?->getId()) {
            return null;
        }

        return DemandeResponseDTO::fromEntity($demande);
    }

    /**
     * Crée une nouvelle demande d'emprunt (par user).
     *
     * @throws LivreNotFoundException
     * @throws LivreNotAvailableException
     */
    public function createDemande(CreateDemandeDTO $createDemandeDTO, User $user): DemandeResponseDTO
    {
        // Vérifier que le livre existe
        $livre = $this->livreRepository->find($createDemandeDTO->livreId);
        if (!$livre) {
            throw new LivreNotFoundException('Le livre demandé n\'existe pas');
        }

        // Vérifier que le livre est disponible
        if (!$livre->isDisponible()) {
            throw new LivreNotAvailableException('Ce livre n\'est pas disponible pour le moment');
        }

        // Créer la demande
        $demande = new Demande();
        $demande->setUser($user);
        $demande->setLivre($livre);
        $demande->setStatut(Demande::STATUT_EN_ATTENTE);

        $this->entityManager->persist($demande);
        $this->entityManager->flush();

        return DemandeResponseDTO::fromEntity($demande);
    }

    /**
     * Met à jour une demande existante (par admin uniquement).
     * Gère la logique de disponibilité du livre selon le statut.
     */
    public function updateDemande(int $id, UpdateDemandeDTO $updateDemandeDTO): ?DemandeResponseDTO
    {
        $demande = $this->demandeRepository->find($id);

        if (!$demande) {
            return null;
        }

        $ancienStatut = $demande->getStatut();
        $nouveauStatut = $updateDemandeDTO->statut;

        // Mise à jour du statut et logique de disponibilité
        if ($nouveauStatut !== null && $nouveauStatut !== $ancienStatut) {
            $demande->setStatut($nouveauStatut);
            $livre = $demande->getLivre();

            // Si la demande passe à "approuvee", marquer le livre comme non disponible
            if ($nouveauStatut === Demande::STATUT_APPROUVEE) {
                $livre->setDisponible(false);
            }

            // Si la demande passe à "retournee", marquer le livre comme disponible
            if ($nouveauStatut === Demande::STATUT_RETOURNEE) {
                $livre->setDisponible(true);
                $demande->setDateRetour(new \DateTime());
            }

            // Si la demande est refusée et qu'elle était approuvée, rendre le livre disponible
            if ($nouveauStatut === Demande::STATUT_REFUSEE && $ancienStatut === Demande::STATUT_APPROUVEE) {
                $livre->setDisponible(true);
            }
        }

        // Mise à jour du commentaire
        if ($updateDemandeDTO->commentaire !== null) {
            $demande->setCommentaire($updateDemandeDTO->commentaire);
        }

        $this->entityManager->flush();

        return DemandeResponseDTO::fromEntity($demande);
    }

    /**
     * Supprime une demande (par admin uniquement).
     * Si la demande était approuvée, le livre redevient disponible.
     */
    public function deleteDemande(int $id): bool
    {
        $demande = $this->demandeRepository->find($id);

        if (!$demande) {
            return false;
        }

        // Si la demande était approuvée, rendre le livre disponible
        if ($demande->getStatut() === Demande::STATUT_APPROUVEE) {
            $livre = $demande->getLivre();
            $livre->setDisponible(true);
        }

        $this->entityManager->remove($demande);
        $this->entityManager->flush();

        return true;
    }
}
