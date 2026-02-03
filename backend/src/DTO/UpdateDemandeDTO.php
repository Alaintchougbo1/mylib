<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la mise à jour d'une demande existante (par admin).
 */
class UpdateDemandeDTO
{
    #[Assert\Choice(
        choices: ['en_attente', 'approuvee', 'refusee', 'retournee'],
        message: 'Le statut doit être en_attente, approuvee, refusee ou retournee'
    )]
    public ?string $statut = null;

    public ?string $commentaire = null;
}
