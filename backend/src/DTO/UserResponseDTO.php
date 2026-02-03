<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\User;

/**
 * DTO pour la réponse contenant les informations d'un utilisateur.
 * Ne contient jamais le mot de passe hashé.
 */
class UserResponseDTO
{
    public int $id;
    public string $email;
    public string $nom;
    public string $prenom;
    public string $role;
    public string $createdAt;
    public string $updatedAt;

    /**
     * Crée un UserResponseDTO depuis une entité User.
     */
    public static function fromEntity(User $user): self
    {
        $dto = new self();
        $dto->id = $user->getId();
        $dto->email = $user->getEmail();
        $dto->nom = $user->getNom();
        $dto->prenom = $user->getPrenom();
        $dto->role = $user->getRole();
        $dto->createdAt = $user->getCreatedAt()->format('Y-m-d H:i:s');
        $dto->updatedAt = $user->getUpdatedAt()->format('Y-m-d H:i:s');

        return $dto;
    }
}
