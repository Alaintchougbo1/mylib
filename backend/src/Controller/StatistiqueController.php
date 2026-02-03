<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\StatistiqueService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

/**
 * Controller gérant les statistiques de la bibliothèque.
 */
#[Route('/api/statistiques')]
#[OA\Tag(name: 'Statistiques')]
#[IsGranted('ROLE_ADMIN', message: 'Accès réservé aux administrateurs')]
class StatistiqueController extends AbstractController
{
    public function __construct(
        private readonly StatistiqueService $statistiqueService
    ) {
    }

    /**
     * Récupère les statistiques de la bibliothèque (ADMIN uniquement).
     */
    #[Route('', name: 'statistiques_get', methods: ['GET'])]
    #[OA\Get(
        path: '/api/statistiques',
        summary: 'Récupère les statistiques de la bibliothèque (ADMIN uniquement)',
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Statistiques de la bibliothèque',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'total_livres', type: 'integer', example: 100, description: 'Nombre total de livres'),
                        new OA\Property(property: 'livres_empruntes', type: 'integer', example: 25, description: 'Nombre de livres actuellement empruntés'),
                        new OA\Property(property: 'livres_disponibles', type: 'integer', example: 75, description: 'Nombre de livres disponibles'),
                        new OA\Property(property: 'total_utilisateurs', type: 'integer', example: 50, description: 'Nombre total d\'utilisateurs inscrits'),
                        new OA\Property(property: 'total_demandes', type: 'integer', example: 120, description: 'Nombre total de demandes'),
                        new OA\Property(property: 'demandes_en_attente', type: 'integer', example: 10, description: 'Nombre de demandes en attente'),
                        new OA\Property(property: 'demandes_approuvees', type: 'integer', example: 80, description: 'Nombre de demandes approuvées'),
                        new OA\Property(property: 'demandes_refusees', type: 'integer', example: 30, description: 'Nombre de demandes refusées'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function get(): JsonResponse
    {
        $statistiques = $this->statistiqueService->getStatistiques();
        return $this->json($statistiques, Response::HTTP_OK);
    }
}
