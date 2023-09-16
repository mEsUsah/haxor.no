<?php
/**
 * haxor plugin for Craft CMS 3.x
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
class ThmService extends Component
{
    // Private Properties
    // =========================================================================
    private $thmCacheDuration = 3600;
    
    // Public Methods
    // =========================================================================

    /**
     * This function can literally be anything you want, and you can have as many service
     * functions as you want
     *
     * From any other plugin file, call it like this:
     *
     *     Haxor::getInstance()->thm->getScoreboard($locations)
     *
     * @return mixed
     */

    public function getScoreBoardUpdate()
    {
        $cacheKey = md5("getTryHackMeScoreboardUpdated");
        $updatedTime = Craft::$app->cache->get($cacheKey);
        if ($updatedTime != null ) {
            return $updatedTime;
        }
        return null;
    }

    public function getScoreboard($locations)
    {
        $cacheKey = md5("getTryHackMeScoreboard");
        $cachedData = Craft::$app->cache->get($cacheKey);
        if ($cachedData != null ) {
            return $cachedData;
        }
        
        $returnArray = [
            "updated" => date("c"),
            "contries" => array(),
            "scoreboard" => array()
        ];

        Craft::$app->cache->set(md5("getTryHackMeScoreboardUpdated"), $returnArray['updated'], $this->thmCacheDuration);

        foreach ($locations as $location) {
            array_push($returnArray["contries"], $location);

            $url = "https://tryhackme.com/api/leaderboards?country=" . $location;
            $_h = curl_init();
            curl_setopt($_h, CURLOPT_HEADER, false);
            curl_setopt($_h, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($_h, CURLOPT_HTTPGET, 1);
            curl_setopt($_h, CURLOPT_URL, $url );
            curl_setopt($_h, CURLOPT_DNS_USE_GLOBAL_CACHE, false );
            curl_setopt($_h, CURLOPT_DNS_CACHE_TIMEOUT, 2 );

            $result = json_decode(curl_exec($_h), true);
            $ranks = $result["ranks"];

            foreach ($ranks as $rank){
                array_push($returnArray["scoreboard"], $rank);
            }
        }

        usort($returnArray["scoreboard"], function ($item1, $item2) {
            return $item2['points'] <=> $item1['points'];
        });
        
        Craft::$app->cache->set($cacheKey, $returnArray, $this->thmCacheDuration);
        return $returnArray;
    }
}
