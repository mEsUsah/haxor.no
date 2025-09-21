<?php
/**
 * haxor plugin for Craft CMS 3.x
 *
 * Plugin for haxor.no
 *
 * @link      haxor.no
 * @copyright Copyright (c) 2021 Stanley Skarshaug
 */

namespace mesusah\crafthaxor\services;

use mesusah\crafthaxor\Haxor;

use Craft;
use craft\helpers\App;
use craft\base\Component;
use craft\elements\Entry;
use craft\elements\User;

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
    private $siteUrl;
    private $publisherLogo;
    
    // Public Methods
    // =========================================================================

    public function __construct()
    {
        $this->siteUrl = App::env('PRIMARY_SITE_URL');
        $this->publisherLogo = $this->siteUrl . '/android-chrome-512x512.png';
    }


    /**
     * Get all articles as an array that can be used in a JSON feed or sitemap.
     *
     * From any other plugin file, call it like this:
     *
     *     Haxor::getInstance()->articles->getAll()
     *
     * @return mixed
     */

    public function getAll()
    {
        $cacheKey = 'articles_get_all';
        $cache = Craft::$app->getCache();
        $cachedData = $cache->get($cacheKey);
        if ($cachedData) {
            return $cachedData;
        }
        
        $articles = Entry::find()
            ->site([
                'default', 
                'haxorNoEn',
            ])
            ->section([
                'articles',
                'portfolio', 
                'ctfWriteups',
                'aboutme',
                'aboutblog'
            ])
            ->all();

        $output = [];
        foreach ($articles as $article) {
            $intro = "";
            $contentBlock = $article->contentBlocks->one();
            if ($contentBlock->type->handle == "text" && $contentBlock->text) {
                $intro = strip_tags($contentBlock->text->rawContent);
            }
            
            array_push($output, [
                'language' => $article->site->language,
                'title' => $article->title,
                'teaser' => $article->teaser,
                'intro' => $intro,
                'subject' => $article->articleSubject->one()->slug ?? 'info',
                'url' => $article->url,
                'datePost' => $article->postDate->format('Y-m-d'),
                'dateUpdate' => $article->dateUpdated->format('Y-m-d'),
                'image' => $article->articleImage?->one()?->getUrl('articleThumbnail', true),
            ]);
        }

        $cache->set($cacheKey, $output, false, null);

        return $output;
    }

    function getArticleJsonLd(Entry $entry) : string
    {
        $image = $entry->articleImage?->one() ?? null;
        $authorName = $entry->author?->fullName ? $entry->author->fullName : User::find()->one()->fullName;
        $authorUrl = Craft::$app->getSites()->getPrimarySite()->getBaseUrl() . 'en/about-me';

        $jsonLd = [
            "@context" => "https://schema.org",
            "@type" => "Article",
            "mainEntityOfPage" => [
                "@type" => "WebPage",
                "@id" => ltrim($entry->url, '/'),
            ],
            "headline" => $entry->title,
            "description" => $entry->teaser,
            "datePublished" => $entry->postDate->format(DATE_ATOM),
            "dateModified" => $entry->dateUpdated->format(DATE_ATOM),
            "author" => [
                "@type" => "Person",
                "name" => $authorName,
                "url" => $authorUrl,
            ],
            "copyrightHolder" => [
                "@type" => "Person",
                "name" => $authorName,
                "url" => $authorUrl,
            ],
            "copyrightYear" => $entry->postDate->format('Y'),
            "publisher" => [
                "@type" => "Organization",
                "name" => "haxor.no",
                "logo" => [
                    "@type" => "ImageObject",
                    "url" => $this->publisherLogo,
                ],
            ],
            "inLanguage" => $entry->site->language,
            "isFamilyFriendly" => "True",
        ];
        if ($image) {
            $imageTransform = [
                'width' => 1000,
                'height' => 600,
                'quality' => 100,
                'format' => 'webp',
                'mode' => 'crop',
                'position' => $image->focalPoint["x"] . "," . $image->focalPoint["y"],
            ];
            
            $jsonLd["image"] = [
                "@type" => "ImageObject",
                "url" => $image->getUrl($imageTransform, true),
                "width" => 1000,
                "height" => 600,
                "datePublished" => $image->dateCreated->format(DATE_ATOM),
                "dateModified" => $image->dateCreated->format(DATE_ATOM),
                "representativeOfPage" => "True",
            ];
        }

        return json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
