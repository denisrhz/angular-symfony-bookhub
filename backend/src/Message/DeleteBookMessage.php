<?php
namespace App\Message;

class DeleteBookMessage {
    public function __construct(public int $id) {}
}