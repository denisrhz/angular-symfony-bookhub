<?php

namespace App\DataFixtures;

use App\Entity\Author;
use App\Entity\Book;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $authors = [];
        for ($i = 1; $i <= 5; $i++) {
            $author = new Author();
            $author->setName("Автор #$i");
            $manager->persist($author);
            $authors[] = $author;
        }

        for ($j = 1; $j <= 10; $j++) {
            $book = new Book();
            $book->setTitle("Книга #$j");
            $book->setDescription("Описание #$j");
            
            $randomAuthor = $authors[array_rand($authors)];
            $book->addAuthor($randomAuthor);
            
            $manager->persist($book);
        }

        $manager->flush();
    }
}