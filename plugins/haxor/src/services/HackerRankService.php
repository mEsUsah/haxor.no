<?php
/**
 * haxor plugin for Craft CMS 4.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
 */

namespace skarshaugsolutions\haxor\services;

use skarshaugsolutions\haxor\Haxor;

use Craft;
use craft\base\Component;

/**
 * HaxorService Service
 *
 * All of your plugin’s business logic should go in services, including saving data,
 * retrieving data, etc. They provide APIs that your controllers, template variables,
 * and other plugins can interact with.
 *
 * https://craftcms.com/docs/plugins/services
 *
 * @author    Stanley Skarshaug
 * @package   Haxor
 * @since     1.0.0
 */
class HackerRankService extends Component
{
    // Private Properties
    // =========================================================================
    private $hackerRankCacheDuration = 3600;
    
    // Public Methods
    // =========================================================================

    /**
     * This function can literally be anything you want, and you can have as many service
     * functions as you want
     *
     * From any other plugin file, call it like this:
     *
     *     Haxor::getInstance()->hackerRank->getScores($username)
     *
     * @return mixed
     */

    public function getScoresUpdate()
    {
        $cacheKey = md5("getHackerRankScoresUpdated");
        $updatedTime = Craft::$app->cache->get($cacheKey);
        if ($updatedTime != null ) {
            return $updatedTime;
        }
        return null;
    }

    public function getScores($username)
    {
        $cacheKey = md5("getHackerRankScores");
        $cachedData = Craft::$app->cache->get($cacheKey);
        if ($cachedData != null ) {
            return $cachedData;
        }
        
        $returnArray = [
            "updated" => date("c"),
            "scores" => array()
        ];

        Craft::$app->cache->set(md5("getHackerRankScoresUpdated"), $returnArray['updated'], $this->hackerRankCacheDuration);

        $url = "https://www.hackerrank.com/rest/hackers/{$username}/scores_elo";
        $_h = curl_init();
        curl_setopt($_h, CURLOPT_HEADER, false);
        curl_setopt($_h, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($_h, CURLOPT_HTTPGET, 1);
        curl_setopt($_h, CURLOPT_URL, $url );
        curl_setopt($_h, CURLOPT_DNS_USE_GLOBAL_CACHE, false );
        curl_setopt($_h, CURLOPT_DNS_CACHE_TIMEOUT, 2 );
        curl_setopt($_h, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36');


        $result = json_decode(curl_exec($_h), true);
        $returnArray["scores"] = $result;
        
        Craft::$app->cache->set($cacheKey, $returnArray, $this->hackerRankCacheDuration);
        return $returnArray;
    }
}
