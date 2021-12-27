<?php
/**
 * haxor plugin for Craft CMS 3.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
 */

namespace skarshaugsolutions\haxor\variables;

use skarshaugsolutions\haxor\Haxor;

use Craft;

/**
 * haxor Variable
 *
 * Craft allows plugins to provide their own template variables, accessible from
 * the {{ craft }} global variable (e.g. {{ craft.haxor }}).
 *
 * https://craftcms.com/docs/plugins/variables
 *
 * @author    Stanley Skarshaug
 * @package   Haxor
 * @since     1.0.0
 */
class HaxorVariable
{
    // Public Methods
    // =========================================================================

    /**
     * Whatever you want to output to a Twig template can go into a Variable method.
     * You can have as many variable functions as you want.  From any Twig template,
     * call it like this:
     *
     *     {{ craft.haxor.exampleVariable }}
     *
     * Or, if your variable requires parameters from Twig:
     *
     *     {{ craft.haxor.exampleVariable(twigValue) }}
     *
     * @param null $optional
     * @return string
     */

    public function getLessonTaskAmount($entry){
        $nrOfTasks = 0;
          
        // return -1 if entry is not a lesson
        if ($entry->sectionId != 10){
            return -1;
        }
        
        // Summarize nr of tasks
        $lessonBlocks = $entry->lessonBlocks->all();
        foreach($lessonBlocks as $lessonBlock){
            $handle = $lessonBlock->getType()->handle;
            if($handle === "taskDone"){
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
    
            // Debug: Print lesson array
            // echo "<pre>";
            // print_r($lesson);
            // echo "</pre>";
    
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
            // Debug: Print task answer
            // echo "<pre>";
            // print_r($lesson[$chapter][$task]["a"]);
            // echo "</pre>";
            return $lesson[$chapter][$task]["a"];
        } else {
            return false;
        }
    }
}
