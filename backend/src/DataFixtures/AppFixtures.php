<?php

namespace App\DataFixtures;

use App\Entity\Demande;
use App\Entity\Livre;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // Créer des utilisateurs
        $admin = new User();
        $admin->setEmail('admin@library.com');
        $admin->setNom('Admin');
        $admin->setPrenom('System');
        $admin->setRole('ROLE_ADMIN');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123456'));
        $manager->persist($admin);

        $user1 = new User();
        $user1->setEmail('user1@test.com');
        $user1->setNom('Dupont');
        $user1->setPrenom('Jean');
        $user1->setRole('ROLE_USER');
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'pass123456'));
        $manager->persist($user1);

        $user2 = new User();
        $user2->setEmail('user2@test.com');
        $user2->setNom('Martin');
        $user2->setPrenom('Marie');
        $user2->setRole('ROLE_USER');
        $user2->setPassword($this->passwordHasher->hashPassword($user2, 'pass123456'));
        $manager->persist($user2);

        // Créer des livres
        $livres = [
            [
                'titre' => 'Clean Code',
                'auteur' => 'Robert C. Martin',
                'isbn' => '978-0132350884',
                'description' => 'Un guide pour écrire du code propre et maintenable',
                'disponible' => true
            ],
            [
                'titre' => 'Design Patterns',
                'auteur' => 'Gang of Four',
                'isbn' => '978-0201633610',
                'description' => 'Les patterns de conception orientés objet',
                'disponible' => true
            ],
            [
                'titre' => 'The Pragmatic Programmer',
                'auteur' => 'Andrew Hunt, David Thomas',
                'isbn' => '978-0135957059',
                'description' => 'De l\'artisan logiciel au maître programmeur',
                'disponible' => false
            ],
            [
                'titre' => 'Domain-Driven Design',
                'auteur' => 'Eric Evans',
                'isbn' => '978-0321125215',
                'description' => 'Tackling Complexity in the Heart of Software',
                'disponible' => true
            ],
            [
                'titre' => 'Refactoring',
                'auteur' => 'Martin Fowler',
                'isbn' => '978-0134757599',
                'description' => 'Améliorer la conception du code existant',
                'disponible' => true
            ],
            [
                'titre' => 'Introduction to Algorithms',
                'auteur' => 'Thomas H. Cormen',
                'isbn' => '978-0262033848',
                'description' => 'Le livre de référence sur les algorithmes',
                'disponible' => false
            ],
            [
                'titre' => 'Code Complete',
                'auteur' => 'Steve McConnell',
                'isbn' => '978-0735619678',
                'description' => 'Un guide pratique pour la construction de logiciels',
                'disponible' => true
            ],
            [
                'titre' => 'The Clean Coder',
                'auteur' => 'Robert C. Martin',
                'isbn' => '978-0137081073',
                'description' => 'Un code de conduite pour les programmeurs professionnels',
                'disponible' => true
            ],
            [
                'titre' => 'Working Effectively with Legacy Code',
                'auteur' => 'Michael Feathers',
                'isbn' => '978-0131177055',
                'description' => 'Techniques pour travailler avec du code existant',
                'disponible' => true
            ],
            [
                'titre' => 'Test Driven Development',
                'auteur' => 'Kent Beck',
                'isbn' => '978-0321146530',
                'description' => 'By Example - TDD par l\'exemple',
                'disponible' => true
            ],
            [
                'titre' => 'Patterns of Enterprise Application Architecture',
                'auteur' => 'Martin Fowler',
                'isbn' => '978-0321127426',
                'description' => 'Architecture des applications d\'entreprise',
                'disponible' => true
            ],
            [
                'titre' => 'Head First Design Patterns',
                'auteur' => 'Eric Freeman, Elisabeth Robson',
                'isbn' => '978-0596007126',
                'description' => 'Une introduction visuelle aux design patterns',
                'disponible' => true
            ],
        ];

        $livresEntities = [];
        foreach ($livres as $livreData) {
            $livre = new Livre();
            $livre->setTitre($livreData['titre']);
            $livre->setAuteur($livreData['auteur']);
            $livre->setIsbn($livreData['isbn']);
            $livre->setDescription($livreData['description']);
            $livre->setDisponible($livreData['disponible']);
            $manager->persist($livre);
            $livresEntities[] = $livre;
        }

        // Créer des demandes d'emprunt
        // Demande approuvée (livre emprunté)
        $demande1 = new Demande();
        $demande1->setUser($user1);
        $demande1->setLivre($livresEntities[2]); // The Pragmatic Programmer (non disponible)
        $demande1->setStatut(Demande::STATUT_APPROUVEE);
        $demande1->setDateDemande(new \DateTime('-10 days'));
        $demande1->setCommentaire('J\'aimerais vraiment lire ce livre');
        $manager->persist($demande1);

        // Demande en attente
        $demande2 = new Demande();
        $demande2->setUser($user2);
        $demande2->setLivre($livresEntities[0]); // Clean Code
        $demande2->setStatut(Demande::STATUT_EN_ATTENTE);
        $demande2->setDateDemande(new \DateTime('-2 days'));
        $manager->persist($demande2);

        // Demande approuvée et retournée
        $demande3 = new Demande();
        $demande3->setUser($user1);
        $demande3->setLivre($livresEntities[1]); // Design Patterns
        $demande3->setStatut(Demande::STATUT_RETOURNEE);
        $demande3->setDateDemande(new \DateTime('-30 days'));
        $demande3->setDateRetour(new \DateTime('-5 days'));
        $demande3->setCommentaire('Excellent livre !');
        $manager->persist($demande3);

        // Demande refusée
        $demande4 = new Demande();
        $demande4->setUser($user2);
        $demande4->setLivre($livresEntities[5]); // Introduction to Algorithms
        $demande4->setStatut(Demande::STATUT_REFUSEE);
        $demande4->setDateDemande(new \DateTime('-15 days'));
        $demande4->setCommentaire('Déjà emprunté par un autre utilisateur');
        $manager->persist($demande4);

        // Demande approuvée (livre actuellement emprunté)
        $demande5 = new Demande();
        $demande5->setUser($user2);
        $demande5->setLivre($livresEntities[5]); // Introduction to Algorithms (non disponible)
        $demande5->setStatut(Demande::STATUT_APPROUVEE);
        $demande5->setDateDemande(new \DateTime('-7 days'));
        $manager->persist($demande5);

        $manager->flush();

        echo "✅ Fixtures chargées avec succès !\n";
        echo "📚 12 livres créés\n";
        echo "👥 3 utilisateurs créés\n";
        echo "📋 5 demandes d'emprunt créées\n";
        echo "\nComptes créés :\n";
        echo "  Admin: admin@library.com / admin123456\n";
        echo "  User1: user1@test.com / pass123456\n";
        echo "  User2: user2@test.com / pass123456\n";
    }
}
