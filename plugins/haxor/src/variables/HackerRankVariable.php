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
class HackerRankVariable
{
    // Public Methods
    // =========================================================================

    /**
     * Whatever you want to output to a Twig template can go into a Variable method.
     * You can have as many variable functions as you want.  From any Twig template,
     * call it like this:
     *
     *     {{ craft.hackerRank.exampleVariable }}
     *
     * Or, if your variable requires parameters from Twig:
     *
     *     {{ craft.hackerRank.exampleVariable(twigValue) }}
     *     {{ craft.hackerRank.getScores() }}
     *
     * @param null $optional
     * @return string
     */


    public function getScores($username)
    {
        return Haxor::getInstance()->hackerRank->getScores($username);
    }
}
