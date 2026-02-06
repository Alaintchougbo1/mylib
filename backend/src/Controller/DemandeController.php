<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\CreateDemandeDTO;
use App\DTO\UpdateDemandeDTO;
use App\Entity\User;
use App\Exception\LivreNotAvailableException;
use App\Exception\LivreNotFoundException;
use App\Service\DemandeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

/**
 * Controller gérant les opérations CRUD sur les demandes d'emprunt.
 */
#[Route('/api/demandes')]
#[OA\Tag(name: 'Demandes')]
class DemandeController extends AbstractController
{
    public function __construct(
        private readonly DemandeService $demandeService,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator
    ) {
    }

    /**
     * Liste toutes les demandes (USER: ses propres demandes, ADMIN: toutes les demandes).
     */
    #[Route('', name: 'demandes_list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/demandes',
        summary: 'Liste des demandes (USER: ses propres demandes, ADMIN: toutes)',
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des demandes',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'user', type: 'object'),
                            new OA\Property(property: 'livre', type: 'object'),
                            new OA\Property(property: 'statut', type: 'string', example: 'en_attente'),
                            new OA\Property(property: 'dateDemande', type: 'string', example: '2024-01-01 12:00:00'),
                            new OA\Property(property: 'dateRetour', type: 'string', example: null, nullable: true),
                            new OA\Property(property: 'commentaire', type: 'string', example: null, nullable: true),
                            new OA\Property(property: 'createdAt', type: 'string'),
                            new OA\Property(property: 'updatedAt', type: 'string'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ]
    )]
    public function list(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles(), true);
        $demandes = $this->demandeService->getAllDemandes($user, $isAdmin);

        return $this->json($demandes, Response::HTTP_OK);
    }

    /**
     * Récupère les détails d'une demande.
     */
    #[Route('/{id}', name: 'demandes_show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/demandes/{id}',
        summary: 'Détails d\'une demande',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de la demande',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Détails de la demande',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'user', type: 'object'),
                        new OA\Property(property: 'livre', type: 'object'),
                        new OA\Property(property: 'statut', type: 'string', example: 'en_attente'),
                        new OA\Property(property: 'dateDemande', type: 'string', example: '2024-01-01 12:00:00'),
                        new OA\Property(property: 'dateRetour', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'commentaire', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'createdAt', type: 'string'),
                        new OA\Property(property: 'updatedAt', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Demande non trouvée'),
        ]
    )]
    public function show(int $id, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles(), true);
        $demande = $this->demandeService->getDemandeById($id, $user, $isAdmin);

        if (!$demande) {
            return $this->json(['error' => 'Demande non trouvée', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json($demande, Response::HTTP_OK);
    }

    /**
     * Crée une nouvelle demande d'emprunt (USER uniquement).
     */
    #[Route('', name: 'demandes_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER', message: 'Vous devez être authentifié pour créer une demande')]
    #[OA\Post(
        path: '/api/demandes',
        summary: 'Créer une demande d\'emprunt (USER uniquement)',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'livreId', type: 'integer', example: 1),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Demande créée avec succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'user', type: 'object'),
                        new OA\Property(property: 'livre', type: 'object'),
                        new OA\Property(property: 'statut', type: 'string', example: 'en_attente'),
                        new OA\Property(property: 'dateDemande', type: 'string', example: '2024-01-01 12:00:00'),
                        new OA\Property(property: 'dateRetour', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'commentaire', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'createdAt', type: 'string'),
                        new OA\Property(property: 'updatedAt', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Données invalides ou livre non disponible'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 404, description: 'Livre non trouvé'),
        ]
    )]
    public function create(Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Les admins ne peuvent pas créer de demandes
        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return $this->json(['error' => 'Les administrateurs ne peuvent pas créer de demandes d\'emprunt'], Response::HTTP_FORBIDDEN);
        }

        try {
            $createDemandeDTO = $this->serializer->deserialize(
                $request->getContent(),
                CreateDemandeDTO::class,
                'json'
            );

            $errors = $this->validator->validate($createDemandeDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $demande = $this->demandeService->createDemande($createDemandeDTO, $user);

            return $this->json($demande, Response::HTTP_CREATED);
        } catch (LivreNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        } catch (LivreNotAvailableException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la création de la demande'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Met à jour une demande existante (ADMIN uniquement).
     */
    #[Route('/{id}', name: 'demandes_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
    #[OA\Put(
        path: '/api/demandes/{id}',
        summary: 'Mettre à jour une demande (ADMIN uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de la demande',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'statut', type: 'string', enum: ['en_attente', 'approuvee', 'refusee', 'retournee'], nullable: true),
                    new OA\Property(property: 'commentaire', type: 'string', example: 'Livre endommagé', nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Demande mise à jour avec succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'user', type: 'object'),
                        new OA\Property(property: 'livre', type: 'object'),
                        new OA\Property(property: 'statut', type: 'string', example: 'en_attente'),
                        new OA\Property(property: 'dateDemande', type: 'string', example: '2024-01-01 12:00:00'),
                        new OA\Property(property: 'dateRetour', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'commentaire', type: 'string', example: null, nullable: true),
                        new OA\Property(property: 'createdAt', type: 'string'),
                        new OA\Property(property: 'updatedAt', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Demande non trouvée'),
        ]
    )]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $updateDemandeDTO = $this->serializer->deserialize(
                $request->getContent(),
                UpdateDemandeDTO::class,
                'json'
            );

            $errors = $this->validator->validate($updateDemandeDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $demande = $this->demandeService->updateDemande($id, $updateDemandeDTO);

            if (!$demande) {
                return $this->json(['error' => 'Demande non trouvée', 'code' => 404], Response::HTTP_NOT_FOUND);
            }

            return $this->json($demande, Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la mise à jour de la demande'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprime une demande (ADMIN uniquement).
     */
    #[Route('/{id}', name: 'demandes_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
    #[OA\Delete(
        path: '/api/demandes/{id}',
        summary: 'Supprimer une demande (ADMIN uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID de la demande',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Demande supprimée avec succès'
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Demande non trouvée'),
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $deleted = $this->demandeService->deleteDemande($id);

        if (!$deleted) {
            return $this->json(['error' => 'Demande non trouvée', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
