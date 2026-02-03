<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la création d'une nouvelle demande d'emprunt (par user).
 */
class CreateDemandeDTO
{
    #[Assert\NotBlank(message: 'L\'ID du livre est obligatoire')]
    #[Assert\Positive(message: 'L\'ID du livre doit être positif')]
    public int $livreId;
}
