<?php
namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AuthorDto {
    #[Assert\NotBlank]
    public string $name;
}