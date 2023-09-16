<?php
/**
 * haxor plugin for Craft CMS 4.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2022 Stanley Skarshaug
 */

namespace skarshaugsolutions\haxor\controllers;

use skarshaugsolutions\haxor\Haxor;

use Craft;
use craft\web\Controller;

/**
 * Default Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your plugin’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    Stanley Skarshaug
 * @package   Haxor
 * @since     1.0.0
 */
class ThmController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected array|int|bool $allowAnonymous = ['index'];

    // Public Methods
    // =========================================================================

    /**
     * Handle a request going to our plugin's index action URL,
     * e.g.: actions/haxor/thm
     *
     * @return mixed
     */
    public function actionIndex()
    {
        $locations = ["no","se","dk","fi","is"];
        return $this->asJson(Haxor::$plugin->haxorService->getTryHackMeScoreboard($locations));
    }
}
