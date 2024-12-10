<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseFieldMergeMigration;

/**
 * m241210_173222_merge_chapterHeadline_into_headline migration.
 */
class m241210_173222_merge_chapterHeadline_into_headline extends BaseFieldMergeMigration
{
    public string $persistingFieldUid = 'b47d1535-bf95-4240-8817-43e15b459bc1';
    public string $outgoingFieldUid = '6a70457e-a328-490d-8e43-da01bd0fb461';
}
