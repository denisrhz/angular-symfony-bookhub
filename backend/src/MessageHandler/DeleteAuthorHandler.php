<?php
namespace App\MessageHandler;

use App\Message\DeleteAuthorMessage;
use App\Repository\AuthorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class DeleteAuthorHandler {
    public function __construct(
        private EntityManagerInterface $em,
        private AuthorRepository $repository
    ) {}

    public function __invoke(DeleteAuthorMessage $msg) {
        $author = $this->repository->find($msg->id);
        if ($author) {
            $this->em->remove($author);
            $this->em->flush();
        }
    }
}