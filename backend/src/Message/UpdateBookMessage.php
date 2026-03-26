<?php
namespace App\Message;

class UpdateBookMessage {
    public function __construct(
        public int $id,
        public string $title,
        public string $description,
        public array $authorIds
    ) {}
}