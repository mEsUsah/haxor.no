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
use craft\elements\Entry;

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
class HaxorService extends Component
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
     *     Haxor::$plugin->haxorService->exampleService()
     *
     * @return mixed
     */

    public function getEntryById($entryID)
    {
        return Entry::find()->id($entryID)->one();
    }

    public function getLessonTaskAmount($entry)
    {
        $nrOfTasks = 0;
          
        // return -1 if entry is not a lesson
        if ($entry->sectionId != 10){
            return -1;
        }
        
        // Summarize nr of tasks
        $lessonBlocks = $entry->lessonBlocks->all();
        foreach($lessonBlocks as $lessonBlock){
            $handle = $lessonBlock->getType()->handle;
            if($handle === "taskDone"|| $handle === "sendInAnswer"){
                $nrOfTasks++;
            }
        }

        return $nrOfTasks;
    }
    
    public function getLessonChapterTaskAmount($entry, $chapter)
    {
        $nrOfTasks = 0;
        $chapterIndex = 0;
          
        // return -1 if entry is not a lesson
        if ($entry->sectionId != 10){
            return -1;
        }
        
        // Summarize nr of tasks in selected chapter
        $lessonBlocks = $entry->lessonBlocks->all();
        foreach($lessonBlocks as $lessonBlock){
            $handle = $lessonBlock->getType()->handle;
            if($handle === "chapter"){
                $chapterIndex++;
            }
            if(($handle === "taskDone" || $handle === "sendInAnswer") && $chapterIndex == $chapter){
                $nrOfTasks++;
            }
        }

        return $nrOfTasks;
    }

    public function getLessonTasks($entry)
    {           
        if($entry->lessonBlocks){
            
            $lessonBlocks = $entry->lessonBlocks->all();
            
            // Build array of chapters and tasks in lesson
            $lesson = [];
            $chapterIndex = 0;
            $taskIndex = 0;
            foreach($lessonBlocks as $lessonBlock){
                $handle = $lessonBlock->getType()->handle;
                if($handle === "chapter"){
                    $chapterIndex++;
                    $taskIndex = 0;
                    $lesson[$chapterIndex] = [];
                }
                if($handle === "taskDone"){
                    $taskIndex++;
                    $lesson[$chapterIndex][$taskIndex] = $lessonBlock->fieldValues["taskText"];
                }
                if($handle === "sendInAnswer"){
                    $taskIndex++;
                    $lesson[$chapterIndex][$taskIndex]["q"] = $lessonBlock->fieldValues["question"];
                    $lesson[$chapterIndex][$taskIndex]["a"] = $lessonBlock->fieldValues["answer"];
                }
            }     

            return $lesson;
        } else {
            // Entry does not contain lessonBlocks
            return false;
        }
    }

    public function getLessonTaskAnswer($entry, $chapter, $task)
    {    
        $lesson = $this->getLessonTasks($entry);

        if(isset($lesson[$chapter][$task]["a"])){
            return $lesson[$chapter][$task]["a"];
        } else {
            return false;
        }
    }

    public function getLessonTaskAnswerObfuscated($entry, $chapter, $task)
    {
        $lesson = $this->getLessonTasks($entry);

        if(isset($lesson[$chapter][$task]["a"])){
            $answer = $lesson[$chapter][$task]["a"];
            
            //Obfuscates anything but whitspace characters
            return preg_replace("/[0-9a-zA-Z]/", "∗", $answer); 
        } else {
            return false;
        }
    }

    public function getTryHackMeScoreboard($locations)
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
        
        // if(sizeof($returnArray["scoreboard"]) >= 100){
        //     $returnArray["scoreboard"] = array_slice($returnArray["scoreboard"],0,100,true);
        // }
        Craft::$app->cache->set($cacheKey, $returnArray, $this->thmCacheDuration);
        return $returnArray;
    }
}
