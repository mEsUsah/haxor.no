<?php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use craft\elements\Entry;
use craft\helpers\App;
use GuzzleHttp\Client;
use Tests\utils\ClearCache;

final class EntriesTest extends TestCase
{    
    public function test_can_view_all_published(): void
    {
        ClearCache::run();
        
        $client = new Client([
            'base_uri' =>  App::env('PRIMARY_SITE_URL'),
            'timeout'  => 4.0,
        ]);
        
        $entries = Entry::find()
            ->section([
                // Singles 
                "home",         // Home
                "aboutme",      // About Me
                "aboutblog",    // About blog
                "ctfWriteups",  // CTF Writeup (Overview)
                "bookReviews",  // Book reviews (Overview)
                "course",       // My courses (Overview)
                
                // Channels with viewable content
                "articles",     // Articles
                "portfolio",    // Portfolio
                "lesson",       // Lessons
                "ctfWriteup",   // CTF Writeup
            ])
            ->all();

        foreach ($entries as $entry) {
            $route = $entry->getUrl();
            $response = $client->request('GET', $route);
            
            $this->assertEquals(200, $response->getStatusCode());
        }
    }
}