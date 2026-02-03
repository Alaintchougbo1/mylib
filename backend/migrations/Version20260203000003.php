<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration : création de la table demandes
 */
final class Version20260203000003 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table demandes pour la gestion des demandes d\'emprunt';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE demandes (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            livre_id INT NOT NULL,
            statut VARCHAR(20) NOT NULL DEFAULT \'en_attente\',
            date_demande DATETIME NOT NULL,
            date_retour DATETIME DEFAULT NULL,
            commentaire LONGTEXT DEFAULT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX IDX_BD940CBB A76ED395 (user_id),
            INDEX IDX_BD940CBB37D925CB (livre_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE demandes ADD CONSTRAINT FK_BD940CBBA76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE demandes ADD CONSTRAINT FK_BD940CBB37D925CB FOREIGN KEY (livre_id) REFERENCES livres (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE demandes DROP FOREIGN KEY FK_BD940CBBA76ED395');
        $this->addSql('ALTER TABLE demandes DROP FOREIGN KEY FK_BD940CBB37D925CB');
        $this->addSql('DROP TABLE demandes');
    }
}
