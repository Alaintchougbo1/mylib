<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CreateUtilisateurDTO;
use App\DTO\UpdateUtilisateurDTO;
use App\DTO\UserResponseDTO;
use App\Entity\User;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Service gérant la logique métier liée à la gestion des utilisateurs (par admin).
 */
class UtilisateurService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    /**
     * Récupère tous les utilisateurs.
     *
     * @return UserResponseDTO[]
     */
    public function getAllUtilisateurs(): array
    {
        $users = $this->userRepository->findAll();
        return array_map(fn(User $user) => UserResponseDTO::fromEntity($user), $users);
    }

    /**
     * Récupère un utilisateur par son ID.
     */
    public function getUtilisateurById(int $id): ?UserResponseDTO
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return null;
        }

        return UserResponseDTO::fromEntity($user);
    }

    /**
     * Crée un nouvel utilisateur (par admin).
     *
     * @throws UserAlreadyExistsException
     */
    public function createUtilisateur(CreateUtilisateurDTO $createUtilisateurDTO): UserResponseDTO
    {
        // Vérifier si l'email existe déjà
        $existingUser = $this->userRepository->findOneByEmail($createUtilisateurDTO->email);
        if ($existingUser !== null) {
            throw new UserAlreadyExistsException('Un utilisateur avec cet email existe déjà');
        }

        $user = new User();
        $user->setEmail($createUtilisateurDTO->email);
        $user->setNom($createUtilisateurDTO->nom);
        $user->setPrenom($createUtilisateurDTO->prenom);
        $user->setRole($createUtilisateurDTO->role);

        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $createUtilisateurDTO->password);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return UserResponseDTO::fromEntity($user);
    }

    /**
     * Met à jour un utilisateur existant (par admin).
     */
    public function updateUtilisateur(int $id, UpdateUtilisateurDTO $updateUtilisateurDTO): ?UserResponseDTO
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return null;
        }

        if ($updateUtilisateurDTO->email !== null) {
            // Vérifier si le nouvel email n'est pas déjà utilisé par un autre utilisateur
            $existingUser = $this->userRepository->findOneByEmail($updateUtilisateurDTO->email);
            if ($existingUser !== null && $existingUser->getId() !== $id) {
                throw new UserAlreadyExistsException('Un utilisateur avec cet email existe déjà');
            }
            $user->setEmail($updateUtilisateurDTO->email);
        }

        if ($updateUtilisateurDTO->nom !== null) {
            $user->setNom($updateUtilisateurDTO->nom);
        }

        if ($updateUtilisateurDTO->prenom !== null) {
            $user->setPrenom($updateUtilisateurDTO->prenom);
        }

        if ($updateUtilisateurDTO->role !== null) {
            $user->setRole($updateUtilisateurDTO->role);
        }

        if ($updateUtilisateurDTO->password !== null) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $updateUtilisateurDTO->password);
            $user->setPassword($hashedPassword);
        }

        $this->entityManager->flush();

        return UserResponseDTO::fromEntity($user);
    }

    /**
     * Supprime un utilisateur.
     */
    public function deleteUtilisateur(int $id): bool
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return false;
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return true;
    }
}
