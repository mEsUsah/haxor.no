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
    public function exampleVariable($optional = null)
    {
        $result = "And away we go to the Twig template...";
        if ($optional) {
            $result = "I'm feeling optional today...";
        }
        return $result;
    }

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
}
