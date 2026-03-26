<?php
namespace App\Message;

class CreateAuthorMessage {
    public function __construct(public string $name) {}
}