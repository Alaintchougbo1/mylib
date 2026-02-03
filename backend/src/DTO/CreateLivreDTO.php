<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la création d'un nouveau livre.
 */
class CreateLivreDTO
{
    #[Assert\NotBlank(message: 'Le titre est obligatoire')]
    #[Assert\Length(max: 255, maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères')]
    public string $titre;

    #[Assert\NotBlank(message: 'L\'auteur est obligatoire')]
    #[Assert\Length(max: 255, maxMessage: 'L\'auteur ne peut pas dépasser {{ limit }} caractères')]
    public string $auteur;

    #[Assert\Length(max: 20, maxMessage: 'L\'ISBN ne peut pas dépasser {{ limit }} caractères')]
    public ?string $isbn = null;

    public ?string $description = null;

    public bool $disponible = true;
}
