<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseFieldMergeMigration;

/**
 * m241214_103156_merge_linkEntry_into_selectedEntry migration.
 */
class m241214_103156_merge_linkEntry_into_selectedEntry extends BaseFieldMergeMigration
{
    public string $persistingFieldUid = '71ac9a76-cabc-44c7-8470-bae1c0d43ed0';
    public string $outgoingFieldUid = 'f598728f-d688-4b98-8aab-cf4447b3af95';
}
