<?php

namespace App\Filament\Resources\SystemConfigs\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SystemConfigForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('key')->disabled()->dehydrated(false),
                Textarea::make('value')->required(),
                TextInput::make('description')->disabled()->dehydrated(false),
            ]);
    }
}
