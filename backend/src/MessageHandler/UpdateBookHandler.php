<?php
namespace App\MessageHandler;

use App\Message\UpdateBookMessage;
use App\Repository\BookRepository;
use App\Repository\AuthorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateBookHandler {
    public function __construct(
        private EntityManagerInterface $em,
        private BookRepository $bookRepo,
        private AuthorRepository $authorRepo
    ) {}

    public function __invoke(UpdateBookMessage $msg) {
        $book = $this->bookRepo->find($msg->id);
        if (!$book) return;

        $book->setTitle($msg->title);
        $book->setDescription($msg->description);

        foreach ($book->getAuthors() as $author) {
            $book->removeAuthor($author);
        }

        foreach ($msg->authorIds as $id) {
            $author = $this->authorRepo->find($id);
            if ($author) {
                $book->addAuthor($author);
            }
        }

        $this->em->flush();
    }
}