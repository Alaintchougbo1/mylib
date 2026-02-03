<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Demande;

/**
 * DTO pour la réponse contenant les informations d'une demande.
 */
class DemandeResponseDTO
{
    public int $id;
    public UserResponseDTO $user;
    public LivreResponseDTO $livre;
    public string $statut;
    public string $dateDemande;
    public ?string $dateRetour;
    public ?string $commentaire;
    public string $createdAt;
    public string $updatedAt;

    /**
     * Crée un DemandeResponseDTO depuis une entité Demande.
     */
    public static function fromEntity(Demande $demande): self
    {
        $dto = new self();
        $dto->id = $demande->getId();
        $dto->user = UserResponseDTO::fromEntity($demande->getUser());
        $dto->livre = LivreResponseDTO::fromEntity($demande->getLivre());
        $dto->statut = $demande->getStatut();
        $dto->dateDemande = $demande->getDateDemande()->format('Y-m-d H:i:s');
        $dto->dateRetour = $demande->getDateRetour()?->format('Y-m-d H:i:s');
        $dto->commentaire = $demande->getCommentaire();
        $dto->createdAt = $demande->getCreatedAt()->format('Y-m-d H:i:s');
        $dto->updatedAt = $demande->getUpdatedAt()->format('Y-m-d H:i:s');

        return $dto;
    }

    /**
     * Crée un tableau de DemandeResponseDTO depuis un tableau d'entités Demande.
     *
     * @param Demande[] $demandes
     * @return self[]
     */
    public static function fromEntities(array $demandes): array
    {
        return array_map(fn(Demande $demande) => self::fromEntity($demande), $demandes);
    }
}
