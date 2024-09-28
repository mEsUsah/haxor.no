<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use mesusah\crafthaxor\services\ArticlesService;

final class HaxorArticleServiceTest extends TestCase
{
    public function test_can_get_all_articles(): void
    {
        $articlesService = new ArticlesService();
        $articles = $articlesService->getAll();

        $this->assertIsArray($articles);
        $this->assertTrue(count($articles) > 0);
    }
}