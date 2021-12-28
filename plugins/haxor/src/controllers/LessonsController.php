<?php
/**
 * haxor plugin for Craft CMS 3.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
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
class LessonsController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['index', 'do-something','check-answer'];

    // Public Methods
    // =========================================================================

    /**
     * Handle a request going to our plugin's index action URL,
     * e.g.: actions/haxor/lessons
     *
     * @return mixed
     */
    public function actionIndex()
    {
        $result = 'Welcome to the LessonController actionIndex() method';

        return $result;
    }

    /**
     * Handle a request going to our plugin's actionDoSomething URL,
     * e.g.: actions/haxor/lessons/check-answer
     *
     * @return mixed
     */
    public function actionCheckAnswer()
    {
        $lessonID =  Craft::$app->request->getQueryParam("le");
        $chapterID =  Craft::$app->request->getQueryParam("ch");
        $taskID =  Craft::$app->request->getQueryParam("t");
        $answer = strtolower(Craft::$app->request->getQueryParam("a"));
        
        if(isset($lessonID) && isset($chapterID) && isset($taskID) && isset($answer)){
            $entry = Haxor::$plugin->haxorService->getEntryById($lessonID);
            if(!$entry){
                return false;
            }
            $correctAnswer = strtolower(Haxor::$plugin->haxorService->getLessonTaskAnswer($entry, $chapterID, $taskID));
            if(!$correctAnswer){
                return false;
            }
            if($answer == $correctAnswer){
                return "correct";
            } else {
                return "incorrect";
            }
        }
    }
}
