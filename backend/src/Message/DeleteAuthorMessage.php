<?php
namespace App\Message;

class DeleteAuthorMessage {
    public function __construct(public int $id) {}
}