<?php
/**
 * Craft web bootstrap file
 */
use Dotenv\Dotenv;
use craft\helpers\App;

// Set path constants
define('CRAFT_BASE_PATH', dirname(__DIR__));
define('CRAFT_VENDOR_PATH', CRAFT_BASE_PATH.'/vendor');

// Load Composer's autoloader
require_once CRAFT_VENDOR_PATH.'/autoload.php';

// Load dotenv?
$dotenv = Dotenv::createImmutable(CRAFT_BASE_PATH);
$dotenv->load();

// Load and run Craft
define('CRAFT_ENVIRONMENT',  App::env('ENVIRONMENT') ?: 'production');
$app = require CRAFT_VENDOR_PATH.'/craftcms/cms/bootstrap/web.php';
$app->run();
