<?php
namespace App\MessageHandler;

use App\Entity\Author;
use App\Message\CreateAuthorMessage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateAuthorHandler {
    public function __construct(private EntityManagerInterface $em) {}

    public function __invoke(CreateAuthorMessage $msg) {
        $author = new Author();
        $author->setName($msg->name);
        $this->em->persist($author);
        $this->em->flush();
    }
}