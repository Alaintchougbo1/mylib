<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la connexion d'un utilisateur.
 */
class LoginDTO
{
    #[Assert\NotBlank(message: 'L\'email est obligatoire')]
    #[Assert\Email(message: 'L\'email {{ value }} n\'est pas valide')]
    public string $email;

    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire')]
    public string $password;
}
