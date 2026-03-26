<?php

namespace App\Message;

class CreateBookMessage
{
    public function __construct(
        public string $title,
        public string $description,
        public array $authorIds
    ) {}
}