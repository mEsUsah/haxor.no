<?php
/**
 * haxor plugin for Craft CMS 3.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
 */

namespace skarshaugsolutions\haxor\services;

use skarshaugsolutions\haxor\Haxor;

use Craft;
use craft\base\Component;
use craft\elements\Entry;

/**
 * HaxorService Service
 *
 * All of your plugin’s business logic should go in services, including saving data,
 * retrieving data, etc. They provide APIs that your controllers, template variables,
 * and other plugins can interact with.
 *
 * https://craftcms.com/docs/plugins/services
 *
 * @author    Stanley Skarshaug
 * @package   Haxor
 * @since     1.0.0
 */
class ArticlesService extends Component
{
    // Private Properties
    // =========================================================================
    //private $thmCacheDuration = 3600;
    
    // Public Methods
    // =========================================================================

    /**
     * This function can literally be anything you want, and you can have as many service
     * functions as you want
     *
     * From any other plugin file, call it like this:
     *
     *     Haxor::$plugin->haxorService->exampleService()
     *
     * @return mixed
     */

    public function getEntryById($entryID)
    {
        return Entry::find()->id($entryID)->one();
    }

    public function getAll()
    {
        $articles = Entry::find()
            ->site([
                'default', 
                'haxorNoEn',
            ])
            ->section([
                'articles',
                'portfolio', 
                'ctfWriteups',
            ])
            ->all();

        $output = [];
        foreach ($articles as $article) {
            array_push($output, [
                'title' => $article->title,
                'articleTeaser' => $article->articleTeaser,
                'subject' => $article->articleSubject
                    ->one()
                    ->slug,
                'url' => $article->url,
                'datePost' => $article->postDate->format('Y-m-d'),
                'dateUpdate' => $article->dateUpdated->format('Y-m-d'),
                'image' => $article->articleImage
                    ->one()
                    ->getUrl('articleThumbnail', true),
            ]);
        }
        return $output;
    }

    
}
