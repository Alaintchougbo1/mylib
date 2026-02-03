<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour l'inscription d'un nouvel utilisateur.
 */
class RegisterDTO
{
    #[Assert\NotBlank(message: 'L\'email est obligatoire')]
    #[Assert\Email(message: 'L\'email {{ value }} n\'est pas valide')]
    public string $email;

    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire')]
    #[Assert\Length(min: 6, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères')]
    public string $password;

    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    #[Assert\Length(max: 100, maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères')]
    public string $nom;

    #[Assert\NotBlank(message: 'Le prénom est obligatoire')]
    #[Assert\Length(max: 100, maxMessage: 'Le prénom ne peut pas dépasser {{ limit }} caractères')]
    public string $prenom;

    #[Assert\Choice(choices: ['ROLE_USER', 'ROLE_ADMIN'], message: 'Le rôle doit être ROLE_USER ou ROLE_ADMIN')]
    public string $role = 'ROLE_USER';
}
