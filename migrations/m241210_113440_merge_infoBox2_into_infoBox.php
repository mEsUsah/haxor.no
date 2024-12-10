<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseEntryTypeMergeMigration;

/**
 * m241210_113440_merge_infoBox2_into_infoBox migration.
 */
class m241210_113440_merge_infoBox2_into_infoBox extends BaseEntryTypeMergeMigration
{
    public string $persistingEntryTypeUid = 'ec8d0268-e294-4677-9a70-bf25ab9f87e7';
    public string $outgoingEntryTypeUid = '9352e030-3a6d-4f5f-add4-74e01d270e43';
    public array $layoutElementUidMap = [
    ];
}
