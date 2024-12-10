<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseFieldMergeMigration;

/**
 * m241210_173258_merge_chartHeadline_into_headline migration.
 */
class m241210_173258_merge_chartHeadline_into_headline extends BaseFieldMergeMigration
{
    public string $persistingFieldUid = 'b47d1535-bf95-4240-8817-43e15b459bc1';
    public string $outgoingFieldUid = 'c28731d1-d362-458e-8210-a901f3f0e4ab';
}
