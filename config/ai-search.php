<?php
/**
 * AI Search plugin config
 *
 * Values returned here are merged over whatever's saved in the CP, taking precedence —
 * this is Craft's standard multi-environment plugin-settings convention.
 *
 * @see \craft\services\Plugins::getPluginSettings()
 */

use craft\helpers\App;

return [
    // Never set in the CP — this is the only place the secret is ever read from.
    'apiSecret' => App::env('AI_SEARCH_API_SECRET'),

    // Optional per-environment overrides; leave the env vars unset to manage these from the CP instead.
    'baseUrl' => App::env('AI_SEARCH_BASE_URL') ?: null,
    'contentSourceUuid' => App::env('AI_SEARCH_CONTENT_SOURCE_UUID') ?: null,
];
