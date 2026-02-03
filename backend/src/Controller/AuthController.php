<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\LoginDTO;
use App\DTO\RegisterDTO;
use App\DTO\UserResponseDTO;
use App\Entity\User;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use App\Service\AuthService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

/**
 * Controller gérant l'authentification des utilisateurs.
 */
#[Route('/api/auth')]
#[OA\Tag(name: 'Authentication')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly UserRepository $userRepository,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly JWTTokenManagerInterface $jwtManager
    ) {
    }

    /**
     * Inscription d'un nouvel utilisateur.
     */
    #[Route('/register', name: 'auth_register', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/register',
        summary: 'Inscription d\'un nouvel utilisateur',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                    new OA\Property(property: 'nom', type: 'string', example: 'Dupont'),
                    new OA\Property(property: 'prenom', type: 'string', example: 'Jean'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Utilisateur créé avec succès',
                content: new OA\JsonContent(
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
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 409, description: 'Email déjà utilisé'),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        try {
            // Désérialiser et valider les données
            $registerDTO = $this->serializer->deserialize(
                $request->getContent(),
                RegisterDTO::class,
                'json'
            );

            $errors = $this->validator->validate($registerDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            // Créer l'utilisateur
            $userResponse = $this->authService->register($registerDTO);

            return $this->json($userResponse, Response::HTTP_CREATED);
        } catch (UserAlreadyExistsException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de l\'inscription'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Connexion d'un utilisateur.
     */
    #[Route('/login', name: 'auth_login', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Connexion d\'un utilisateur',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Connexion réussie',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: 'eyJ0eXAiOiJKV1QiLCJhbGc...'),
                        new OA\Property(
                            property: 'user',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                                new OA\Property(property: 'nom', type: 'string', example: 'Dupont'),
                                new OA\Property(property: 'prenom', type: 'string', example: 'Jean'),
                                new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Identifiants incorrects'),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        try {
            // Désérialiser et valider les données
            $loginDTO = $this->serializer->deserialize(
                $request->getContent(),
                LoginDTO::class,
                'json'
            );

            $errors = $this->validator->validate($loginDTO);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            // Récupérer l'utilisateur par email
            $user = $this->userRepository->findOneByEmail($loginDTO->email);

            if (!$user || !$this->passwordHasher->isPasswordValid($user, $loginDTO->password)) {
                return $this->json(['error' => 'Identifiants incorrects'], Response::HTTP_UNAUTHORIZED);
            }

            // Générer le token JWT
            $token = $this->jwtManager->create($user);

            return $this->json([
                'token' => $token,
                'user' => UserResponseDTO::fromEntity($user),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la connexion'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupère les informations de l'utilisateur connecté.
     */
    #[Route('/me', name: 'auth_me', methods: ['GET'])]
    #[OA\Get(
        path: '/api/auth/me',
        summary: 'Récupère les informations de l\'utilisateur connecté',
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Informations de l\'utilisateur',
                content: new OA\JsonContent(
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
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ]
    )]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $userResponse = $this->authService->getCurrentUser($user);

        return $this->json($userResponse, Response::HTTP_OK);
    }
}
