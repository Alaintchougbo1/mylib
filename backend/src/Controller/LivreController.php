<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\CreateLivreDTO;
use App\DTO\UpdateLivreDTO;
use App\Service\LivreService;
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
 * Controller gérant les opérations CRUD sur les livres.
 */
#[Route('/api/livres')]
#[OA\Tag(name: 'Livres')]
class LivreController extends AbstractController
{
    public function __construct(
        private readonly LivreService $livreService,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator
    ) {
    }

    /**
     * Liste tous les livres avec filtres optionnels.
     */
    #[Route('', name: 'livres_list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/livres',
        summary: 'Liste tous les livres',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'titre',
                in: 'query',
                description: 'Filtrer par titre (recherche partielle)',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'auteur',
                in: 'query',
                description: 'Filtrer par auteur (recherche partielle)',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'disponible',
                in: 'query',
                description: 'Filtrer par disponibilité (true/false)',
                required: false,
                schema: new OA\Schema(type: 'boolean')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des livres',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'titre', type: 'string', example: 'Le Petit Prince'),
                            new OA\Property(property: 'auteur', type: 'string', example: 'Antoine de Saint-Exupéry'),
                            new OA\Property(property: 'isbn', type: 'string', example: '978-2-07-061275-8', nullable: true),
                            new OA\Property(property: 'description', type: 'string', example: 'Un conte philosophique...', nullable: true),
                            new OA\Property(property: 'disponible', type: 'boolean', example: true),
                            new OA\Property(property: 'createdAt', type: 'string', example: '2024-01-01 12:00:00'),
                            new OA\Property(property: 'updatedAt', type: 'string', example: '2024-01-01 12:00:00'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ]
    )]
    public function list(Request $request): JsonResponse
    {
        $filters = [
            'titre' => $request->query->get('titre'),
            'auteur' => $request->query->get('auteur'),
            'disponible' => $request->query->get('disponible'),
        ];

        $livres = $this->livreService->getAllLivres($filters);

        return $this->json($livres, Response::HTTP_OK);
    }

    /**
     * Récupère les détails d'un livre.
     */
    #[Route('/{id}', name: 'livres_show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/livres/{id}',
        summary: 'Détails d\'un livre',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID du livre',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Détails du livre',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'titre', type: 'string', example: 'Le Petit Prince'),
                        new OA\Property(property: 'auteur', type: 'string', example: 'Antoine de Saint-Exupéry'),
                        new OA\Property(property: 'isbn', type: 'string', example: '978-2-07-061275-8', nullable: true),
                        new OA\Property(property: 'description', type: 'string', nullable: true),
                        new OA\Property(property: 'disponible', type: 'boolean', example: true),
                        new OA\Property(property: 'createdAt', type: 'string'),
                        new OA\Property(property: 'updatedAt', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 404, description: 'Livre non trouvé'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $livre = $this->livreService->getLivreById($id);

        if (!$livre) {
            return $this->json(['error' => 'Livre non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json($livre, Response::HTTP_OK);
    }

    /**
     * Crée un nouveau livre (Admin uniquement).
     */
    #[Route('', name: 'livres_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
    #[OA\Post(
        path: '/api/livres',
        summary: 'Créer un nouveau livre (Admin uniquement)',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'titre', type: 'string', example: 'Le Petit Prince'),
                    new OA\Property(property: 'auteur', type: 'string', example: 'Antoine de Saint-Exupéry'),
                    new OA\Property(property: 'isbn', type: 'string', example: '978-2-07-061275-8', nullable: true),
                    new OA\Property(property: 'description', type: 'string', example: 'Un conte philosophique...', nullable: true),
                    new OA\Property(property: 'disponible', type: 'boolean', example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Livre créé avec succès',
                content: new OA\JsonContent(ref: '#/components/schemas/LivreResponse')
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function create(Request $request): JsonResponse
    {
        try {
            $createLivreDTO = $this->serializer->deserialize(
                $request->getContent(),
                CreateLivreDTO::class,
                'json'
            );

            $errors = $this->validator->validate($createLivreDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $livre = $this->livreService->createLivre($createLivreDTO);

            return $this->json($livre, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la création du livre'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Met à jour un livre existant (Admin uniquement).
     */
    #[Route('/{id}', name: 'livres_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
    #[OA\Put(
        path: '/api/livres/{id}',
        summary: 'Mettre à jour un livre (Admin uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID du livre',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'titre', type: 'string', example: 'Le Petit Prince', nullable: true),
                    new OA\Property(property: 'auteur', type: 'string', example: 'Antoine de Saint-Exupéry', nullable: true),
                    new OA\Property(property: 'isbn', type: 'string', example: '978-2-07-061275-8', nullable: true),
                    new OA\Property(property: 'description', type: 'string', nullable: true),
                    new OA\Property(property: 'disponible', type: 'boolean', example: true, nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Livre mis à jour avec succès',
                content: new OA\JsonContent(ref: '#/components/schemas/LivreResponse')
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Livre non trouvé'),
        ]
    )]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $updateLivreDTO = $this->serializer->deserialize(
                $request->getContent(),
                UpdateLivreDTO::class,
                'json'
            );

            $errors = $this->validator->validate($updateLivreDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $livre = $this->livreService->updateLivre($id, $updateLivreDTO);

            if (!$livre) {
                return $this->json(['error' => 'Livre non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
            }

            return $this->json($livre, Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la mise à jour du livre'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprime un livre (Admin uniquement).
     */
    #[Route('/{id}', name: 'livres_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
    #[OA\Delete(
        path: '/api/livres/{id}',
        summary: 'Supprimer un livre (Admin uniquement)',
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'ID du livre',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Livre supprimé avec succès'
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
            new OA\Response(response: 404, description: 'Livre non trouvé'),
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $deleted = $this->livreService->deleteLivre($id);

        if (!$deleted) {
            return $this->json(['error' => 'Livre non trouvé', 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
