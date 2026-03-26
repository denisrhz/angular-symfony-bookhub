<?php
namespace App\MessageHandler;

use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Message\DeleteBookMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class DeleteBookHandler {
    public function __construct(private EntityManagerInterface $em, private BookRepository $repository) {}

    public function __invoke(DeleteBookMessage $msg) {
        $book = $this->repository->find($msg->id);
        if ($book) {
            $this->em->remove($book);
            $this->em->flush();
        }
    }
}