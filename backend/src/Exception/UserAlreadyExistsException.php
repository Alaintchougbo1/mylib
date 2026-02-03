<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Exception levée lorsqu'un utilisateur tente de s'inscrire avec un email déjà utilisé.
 */
class UserAlreadyExistsException extends \Exception
{
}
