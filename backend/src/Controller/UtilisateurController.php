<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\CreateUtilisateurDTO;
use App\DTO\UpdateUtilisateurDTO;
use App\Exception\UserAlreadyExistsException;
use App\Service\UtilisateurService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

/**
 * Controller gérant les opérations CRUD sur les utilisateurs (Admin uniquement).
 */
#[Route('/api/utilisateurs')]
#[OA\Tag(name: 'Utilisateurs')]
#[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
class UtilisateurController extends AbstractController
{
    public function __construct(
        private readonly UtilisateurService $utilisateurService,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator
    ) {
    }

    /**
     * Liste tous les utilisateurs (Admin uniquement).
     */
    #[Route('', name: 'utilisateurs_list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/utilisateurs',
        summary: 'Liste tous les utilisateurs (Admin uniquement)',
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des utilisateurs',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                            new OA\Property(property: 'nom', type: 'string', example: 'Dupont'),
                            new OA\Property(property: 'prenom', type: 'string', example: 'Jean'),
                            new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER'),
                            new OA\Property(property: 'createdAt', type: 'string', example: '2024-01-01 12:00:00'),
                            new OA\Property(property: 'updatedAt', type: 'string', example: '2024-01-01 12:00:00'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function list(): JsonResponse
    {
        $utilisateurs = $this->utilisateurService->getAllUtilisateurs();
        return $this->json($utilisateurs, Response::HTTP_OK);
    }

    /**
     * Récupère les détails d'un utilisateur (Admin uniquement).
     */
    #[Route('/{id}', name: 'utilisateurs_show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/utilisateurs/{id}',
        summary: 'Détails d\'un utilisateur (Admin uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de l\'utilisateur',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Détails de l\'utilisateur',
                content: new OA\JsonContent(ref: '#/components/schemas/UserResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Utilisateur non trouvé'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $utilisateur = $this->utilisateurService->getUtilisateurById($id);

        if (!$utilisateur) {
            return $this->json(['error' => 'Utilisateur non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json($utilisateur, Response::HTTP_OK);
    }

    /**
     * Crée un nouvel utilisateur (Admin uniquement).
     */
    #[Route('', name: 'utilisateurs_create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/utilisateurs',
        summary: 'Créer un nouvel utilisateur (Admin uniquement)',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'newuser@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                    new OA\Property(property: 'nom', type: 'string', example: 'Dupont'),
                    new OA\Property(property: 'prenom', type: 'string', example: 'Marie'),
                    new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER', enum: ['ROLE_USER', 'ROLE_ADMIN']),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Utilisateur créé avec succès',
                content: new OA\JsonContent(ref: '#/components/schemas/UserResponse')
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 409, description: 'Email déjà utilisé'),
        ]
    )]
    public function create(Request $request): JsonResponse
    {
        try {
            $createUtilisateurDTO = $this->serializer->deserialize(
                $request->getContent(),
                CreateUtilisateurDTO::class,
                'json'
            );

            $errors = $this->validator->validate($createUtilisateurDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $utilisateur = $this->utilisateurService->createUtilisateur($createUtilisateurDTO);

            return $this->json($utilisateur, Response::HTTP_CREATED);
        } catch (UserAlreadyExistsException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la création de l\'utilisateur'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Met à jour un utilisateur existant (Admin uniquement).
     */
    #[Route('/{id}', name: 'utilisateurs_update', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/utilisateurs/{id}',
        summary: 'Mettre à jour un utilisateur (Admin uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de l\'utilisateur',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'newemail@example.com', nullable: true),
                    new OA\Property(property: 'password', type: 'string', example: 'newpassword123', nullable: true),
                    new OA\Property(property: 'nom', type: 'string', example: 'Nouveau Nom', nullable: true),
                    new OA\Property(property: 'prenom', type: 'string', example: 'Nouveau Prénom', nullable: true),
                    new OA\Property(property: 'role', type: 'string', example: 'ROLE_ADMIN', enum: ['ROLE_USER', 'ROLE_ADMIN'], nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Utilisateur mis à jour avec succès',
                content: new OA\JsonContent(ref: '#/components/schemas/UserResponse')
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Utilisateur non trouvé'),
            new OA\Response(response: 409, description: 'Email déjà utilisé'),
        ]
    )]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $updateUtilisateurDTO = $this->serializer->deserialize(
                $request->getContent(),
                UpdateUtilisateurDTO::class,
                'json'
            );

            $errors = $this->validator->validate($updateUtilisateurDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $utilisateur = $this->utilisateurService->updateUtilisateur($id, $updateUtilisateurDTO);

            if (!$utilisateur) {
                return $this->json(['error' => 'Utilisateur non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
            }

            return $this->json($utilisateur, Response::HTTP_OK);
        } catch (UserAlreadyExistsException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la mise à jour de l\'utilisateur'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprime un utilisateur (Admin uniquement).
     */
    #[Route('/{id}', name: 'utilisateurs_delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/utilisateurs/{id}',
        summary: 'Supprimer un utilisateur (Admin uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de l\'utilisateur',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Utilisateur supprimé avec succès'
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Utilisateur non trouvé'),
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $deleted = $this->utilisateurService->deleteUtilisateur($id);

        if (!$deleted) {
            return $this->json(['error' => 'Utilisateur non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
