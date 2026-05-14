<?php

use craft\helpers\App;

// Use the current host for dev server requests. Otherwise fall back to the primary site.
$host = Craft::$app->getRequest()->getIsConsoleRequest()
    ? App::env('PRIMARY_SITE_URL')
    : Craft::$app->getRequest()->getHostInfo();

$port = App::env('VITE_PORT_HTTPS') ?: 3001;
$environment = defined('CRAFT_ENVIRONMENT')
    ? CRAFT_ENVIRONMENT
    : (App::env('ENVIRONMENT') ?: App::env('CRAFT_ENVIRONMENT'));

return [
    'devServerPublic' => "$host:$port",
    'serverPublic' => '/dist',
    'useDevServer' => $environment === 'dev',
    'manifestPath' => '@webroot/dist/manifest.json',
];