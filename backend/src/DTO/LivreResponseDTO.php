<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Livre;

/**
 * DTO pour la réponse contenant les informations d'un livre.
 */
class LivreResponseDTO
{
    public int $id;
    public string $titre;
    public string $auteur;
    public ?string $isbn;
    public ?string $description;
    public bool $disponible;
    public string $createdAt;
    public string $updatedAt;

    /**
     * Crée un LivreResponseDTO depuis une entité Livre.
     */
    public static function fromEntity(Livre $livre): self
    {
        $dto = new self();
        $dto->id = $livre->getId();
        $dto->titre = $livre->getTitre();
        $dto->auteur = $livre->getAuteur();
        $dto->isbn = $livre->getIsbn();
        $dto->description = $livre->getDescription();
        $dto->disponible = $livre->isDisponible();
        $dto->createdAt = $livre->getCreatedAt()->format('Y-m-d H:i:s');
        $dto->updatedAt = $livre->getUpdatedAt()->format('Y-m-d H:i:s');

        return $dto;
    }

    /**
     * Crée un tableau de LivreResponseDTO depuis un tableau d'entités Livre.
     *
     * @param Livre[] $livres
     * @return self[]
     */
    public static function fromEntities(array $livres): array
    {
        return array_map(fn(Livre $livre) => self::fromEntity($livre), $livres);
    }
}
