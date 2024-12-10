<?php

namespace craft\contentmigrations;

use Craft;
use craft\migrations\BaseEntryTypeMergeMigration;

/**
 * m241210_111818_merge_text2_into_text migration.
 */
class m241210_111818_merge_text2_into_text extends BaseEntryTypeMergeMigration
{
    public string $persistingEntryTypeUid = '572f6109-c32e-4df3-8c66-7e5bba2756ea';
    public string $outgoingEntryTypeUid = 'a227fe85-29a0-403f-b510-659257b8c521';
    public array $layoutElementUidMap = [
    ];
}
