<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseEntryTypeMergeMigration;

/**
 * m241210_110206_merge_image2_into_image migration.
 */
class m241210_110206_merge_image2_into_image extends BaseEntryTypeMergeMigration
{
    public string $persistingEntryTypeUid = '409d3c53-f6a8-476d-be5a-5bc8d3acc0f6';
    public string $outgoingEntryTypeUid = 'eac3ade5-8f69-4ee2-b1df-4cc1b1e1b9b7';
    public array $layoutElementUidMap = [
    ];
}
