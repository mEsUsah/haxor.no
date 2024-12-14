<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseFieldMergeMigration;

/**
 * m241214_113557_merge_courseDescription_into_description migration.
 */
class m241214_113557_merge_courseDescription_into_description extends BaseFieldMergeMigration
{
    public string $persistingFieldUid = 'f490c527-58d9-4ac9-bbba-4b4b537e6e0b';
    public string $outgoingFieldUid = '12c8b9da-5b5a-4bd7-a51e-4116181081ad';
}
