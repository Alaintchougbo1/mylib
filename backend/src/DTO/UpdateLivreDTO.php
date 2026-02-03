<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la mise à jour d'un livre existant.
 */
class UpdateLivreDTO
{
    #[Assert\Length(max: 255, maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères')]
    public ?string $titre = null;

    #[Assert\Length(max: 255, maxMessage: 'L\'auteur ne peut pas dépasser {{ limit }} caractères')]
    public ?string $auteur = null;

    #[Assert\Length(max: 20, maxMessage: 'L\'ISBN ne peut pas dépasser {{ limit }} caractères')]
    public ?string $isbn = null;

    public ?string $description = null;

    public ?bool $disponible = null;
}
