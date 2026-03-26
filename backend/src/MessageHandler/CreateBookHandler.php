<?php

namespace App\MessageHandler;

use App\Entity\Book;
use App\Message\CreateBookMessage;
use App\Repository\AuthorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateBookHandler
{
    public function __construct(
        private EntityManagerInterface $em,
        private AuthorRepository $authorRepository
    ) {}

    public function __invoke(CreateBookMessage $msg)
    {
        $book = new Book();
        $book->setTitle($msg->title);
        $book->setDescription($msg->description);

        foreach ($msg->authorIds as $id) {
            $author = $this->authorRepository->find($id);
            if ($author) {
                $book->addAuthor($author);
            }
        }

        $this->em->persist($book);
        $this->em->flush();
    }
}