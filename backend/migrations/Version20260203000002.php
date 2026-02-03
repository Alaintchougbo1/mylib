<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration : création de la table livres
 */
final class Version20260203000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table livres pour la gestion des livres de la bibliothèque';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE livres (
            id INT AUTO_INCREMENT NOT NULL,
            titre VARCHAR(255) NOT NULL,
            auteur VARCHAR(255) NOT NULL,
            isbn VARCHAR(20) DEFAULT NULL,
            description LONGTEXT DEFAULT NULL,
            disponible TINYINT(1) NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            UNIQUE INDEX UNIQ_921D04C6CC1CF4E6 (isbn),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE livres');
    }
}
