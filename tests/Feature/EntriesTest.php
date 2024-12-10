<?php
namespace Tests\Feature;

use Craft;
use PHPUnit\Framework\TestCase;
use craft\elements\Entry;
use craft\helpers\App;
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request;

final class EntriesTest extends TestCase
{    
    public function test_can_view_all_published(): void
    {
        $client = new Client([
            'base_uri' =>  App::env('PRIMARY_SITE_URL'),
            'timeout'  => 10.0,
            'verify' => false
        ]);

        $sites = Craft::$app->getSites()->getAllSites();
        $entries = [];
        
        // Loop through all sites and get all entries
        foreach ($sites as $site) {
            if($site->handle == 'default') {
                continue;
            }

            $siteEntries = Entry::find()->site($site->handle)->all();
            array_push($entries, ...$siteEntries);
        }

        // Loop through all entries and create a request for each
        $requests = function () use ($entries) {
            foreach ($entries as $entry) {
                if($entry->getUrl() == null) {
                    continue;
                }
                yield new Request('HEAD', $entry->getUrl());
            }
        };

        // Send all requests concurrently
        $pool = new Pool($client, $requests(), [
            'concurrency' => 20,  // Adjust this number based on your server's capacity
            'fulfilled' => function ($response, $index) {
                $this->assertEquals(200, $response->getStatusCode());
            },
            'rejected' => function ($exception, $index) {
                $this->fail("Request failed: " . $exception->getMessage());
            },
        ]);

        $pool->promise()->wait();
    }
}