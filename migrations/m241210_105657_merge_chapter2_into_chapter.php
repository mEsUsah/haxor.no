<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseEntryTypeMergeMigration;

/**
 * m241210_105657_merge_chapter2_into_chapter migration.
 */
class m241210_105657_merge_chapter2_into_chapter extends BaseEntryTypeMergeMigration
{
    public string $persistingEntryTypeUid = '120a0c87-a4cf-4fb4-8e36-2533818e113a';
    public string $outgoingEntryTypeUid = '14fc49ec-a2e2-4953-a06d-e4c93142cc99';
    public array $layoutElementUidMap = [
    ];
}
