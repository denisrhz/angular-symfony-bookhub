<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class BookDto
{
    #[Assert\NotBlank]
    public string $title;

    #[Assert\NotBlank]
    public string $description;

    #[Assert\All([new Assert\Type('integer')])]
    public array $authorIds = [];
}