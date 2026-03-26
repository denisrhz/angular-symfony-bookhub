<?php
namespace App\MessageHandler;

use App\Message\UpdateAuthorMessage;
use App\Repository\AuthorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateAuthorHandler {
    public function __construct(
        private EntityManagerInterface $em,
        private AuthorRepository $repository
    ) {}

    public function __invoke(UpdateAuthorMessage $msg) {
        $author = $this->repository->find($msg->id);
        if ($author) {
            $author->setName($msg->name);
            $this->em->flush();
        }
    }
}