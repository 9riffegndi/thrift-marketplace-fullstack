<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')->required()->maxLength(255),
                FileUpload::make('image_url')->required()->disk('public')->directory('banners'),
                TextInput::make('link_url')->url()->maxLength(255),
                TextInput::make('sort_order')->numeric()->default(0)->required(),
                Toggle::make('status')
                    ->formatStateUsing(fn (?string $state) => $state === 'active')
                    ->dehydrateStateUsing(fn (bool $state) => $state ? 'active' : 'inactive')
                    ->default(true),
            ]);
    }
}
