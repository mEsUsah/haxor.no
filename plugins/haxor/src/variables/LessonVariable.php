<?php
/**
 * haxor plugin for Craft CMS 4.x
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
class LessonVariable
{
    // Public Methods
    // =========================================================================

    /**
     * Whatever you want to output to a Twig template can go into a Variable method.
     * You can have as many variable functions as you want.  From any Twig template,
     * call it like this:
     *
     *     {{ craft.haxorLesson.exampleVariable }}
     *
     * Or, if your variable requires parameters from Twig:
     *
     *     {{ craft.haxorLesson.exampleVariable(twigValue) }}
     *     {{ craft.haxorLesson.getEntryTaskN($entry) }}
     *
     * @param null $optional
     * @return string
     */

    public function getEntryTaskN($entry)
    {
        return Haxor::getInstance()->lessons->getEntryTaskN($entry);
    }

    public function getChapterTaskN($entry, $chapter)
    {
        return Haxor::getInstance()->lessons->getChapterTaskN($entry,$chapter);
    }

    public function getLessonTasks($entry)
    {
        return Haxor::getInstance()->lessons->getLessonTasks($entry);
    }

    public function getTaskAnswer($entry, $chapter, $task)
    {    
        return Haxor::getInstance()->lessons->getTaskAnswer($entry, $chapter, $task);
    }

    public function getTaskAnswerObfuscated($entry, $chapter, $task)
    {
        return Haxor::getInstance()->lessons->getTaskAnswerObfuscated($entry, $chapter, $task);
    }
}
