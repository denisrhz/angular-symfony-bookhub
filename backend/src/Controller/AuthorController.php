<?php
namespace App\Controller;

use App\Dto\AuthorDto;
use App\Message\CreateAuthorMessage;
use App\Message\UpdateAuthorMessage;
use App\Message\DeleteAuthorMessage;
use App\Repository\AuthorRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/authors')]
class AuthorController extends AbstractController {

    #[Route('', methods: ['POST'])]
    public function create(#[MapRequestPayload] AuthorDto $dto, MessageBusInterface $bus): JsonResponse {
        $bus->dispatch(new CreateAuthorMessage($dto->name));
        return $this->json(['message' => 'Accepted'], 202);
    }

    #[Route('', methods: ['GET'])]
    public function index(AuthorRepository $repository): JsonResponse {
        return $this->json($repository->findAll(), context: ['groups' => ['author:read']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id, AuthorRepository $repository): JsonResponse {
        $author = $repository->find($id);
        if (!$author) return $this->json(['error' => 'Not found'], 404);
        return $this->json($author, context: ['groups' => ['author:read']]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, #[MapRequestPayload] AuthorDto $dto, MessageBusInterface $bus): JsonResponse {
        $bus->dispatch(new UpdateAuthorMessage($id, $dto->name));
        return $this->json(['message' => 'Update queued'], 202);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, MessageBusInterface $bus): JsonResponse {
        $bus->dispatch(new DeleteAuthorMessage($id));
        return $this->json(['message' => 'Delete queued'], 202);
    }
}