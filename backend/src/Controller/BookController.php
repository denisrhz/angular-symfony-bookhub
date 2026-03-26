<?php

namespace App\Controller;

use App\Dto\BookDto;
use App\Message\CreateBookMessage;
use App\Message\UpdateBookMessage;
use App\Message\DeleteBookMessage;
use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/books')]
class BookController extends AbstractController {

    #[Route('', methods: ['POST'])]
    public function create(#[MapRequestPayload] BookDto $dto, MessageBusInterface $bus): JsonResponse
    {
        $bus->dispatch(new CreateBookMessage($dto->title, $dto->description, $dto->authorIds));
        return $this->json(['message' => 'Book creation queued'], 202);
    }

    #[Route('', methods: ['GET'])]
    public function index(BookRepository $repository): JsonResponse
    {
        return $this->json($repository->findAll(), context: ['groups' => ['book:read']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id, BookRepository $repository): JsonResponse
    {
        $book = $repository->find($id);
        
        if (!$book) {
            return $this->json(['error' => 'Book not found'], 404);
        }

        return $this->json($book, context: [
            'groups' => ['book:read']
        ]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, #[MapRequestPayload] BookDto $dto, MessageBusInterface $bus): JsonResponse
    {
        $bus->dispatch(new UpdateBookMessage($id, $dto->title, $dto->description, $dto->authorIds));
        return $this->json(['message' => 'Update queued'], 202);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, MessageBusInterface $bus): JsonResponse
    {
        $bus->dispatch(new DeleteBookMessage($id));
        return $this->json(['message' => 'Delete queued'], 202);
    }
}