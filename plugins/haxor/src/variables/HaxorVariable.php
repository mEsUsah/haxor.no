<?php
/**
 * haxor plugin for Craft CMS 4.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
 */

namespace mesusah\crafthaxor\variables;

use mesusah\crafthaxor\Haxor;

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
     *     {{ craft.haxor.getTryHackMeScoreboard($locations) }}
     *
     * @param null $optional
     * @return string
     */


    public function getScoreBoardUpdate()
    {
        return Haxor::getInstance()->thm->getScoreBoardUpdate();
    }

    public function getArticleJsonLd($entry)
    {
        return Haxor::getInstance()->articles->getArticleJsonLd($entry);
    }
}
