<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la mise à jour d'un utilisateur existant (par admin).
 */
class UpdateUtilisateurDTO
{
    #[Assert\Email(message: 'L\'email {{ value }} n\'est pas valide')]
    public ?string $email = null;

    #[Assert\Length(min: 6, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères')]
    public ?string $password = null;

    #[Assert\Length(max: 100, maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères')]
    public ?string $nom = null;

    #[Assert\Length(max: 100, maxMessage: 'Le prénom ne peut pas dépasser {{ limit }} caractères')]
    public ?string $prenom = null;

    #[Assert\Choice(choices: ['ROLE_USER', 'ROLE_ADMIN'], message: 'Le rôle doit être ROLE_USER ou ROLE_ADMIN')]
    public ?string $role = null;
}
