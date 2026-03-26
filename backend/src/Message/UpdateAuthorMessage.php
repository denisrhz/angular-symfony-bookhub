<?php
namespace App\Message;

class UpdateAuthorMessage {
    public function __construct(
        public int $id,
        public string $name
    ) {}
}