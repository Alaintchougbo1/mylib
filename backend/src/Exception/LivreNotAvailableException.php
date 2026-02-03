<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Exception levée lorsqu'un utilisateur tente d'emprunter un livre non disponible.
 */
class LivreNotAvailableException extends \Exception
{
}
