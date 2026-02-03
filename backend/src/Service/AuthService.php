<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\RegisterDTO;
use App\DTO\UserResponseDTO;
use App\Entity\User;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Service gérant la logique métier liée à l'authentification.
 */
class AuthService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    /**
     * Inscrit un nouvel utilisateur.
     *
     * @throws UserAlreadyExistsException Si l'email est déjà utilisé
     */
    public function register(RegisterDTO $registerDTO): UserResponseDTO
    {
        // Vérifier si l'email existe déjà
        $existingUser = $this->userRepository->findOneByEmail($registerDTO->email);
        if ($existingUser !== null) {
            throw new UserAlreadyExistsException('Un utilisateur avec cet email existe déjà');
        }

        // Créer le nouvel utilisateur
        $user = new User();
        $user->setEmail($registerDTO->email);
        $user->setNom($registerDTO->nom);
        $user->setPrenom($registerDTO->prenom);
        $user->setRole('ROLE_USER'); // Par défaut, tout nouvel utilisateur est ROLE_USER

        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $registerDTO->password);
        $user->setPassword($hashedPassword);

        // Persister en base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return UserResponseDTO::fromEntity($user);
    }

    /**
     * Récupère les informations de l'utilisateur connecté.
     */
    public function getCurrentUser(User $user): UserResponseDTO
    {
        return UserResponseDTO::fromEntity($user);
    }
}
