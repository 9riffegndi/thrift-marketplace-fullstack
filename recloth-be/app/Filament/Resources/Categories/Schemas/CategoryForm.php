<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->required()->maxLength(255),
                TextInput::make('slug')->required()->maxLength(255),
                TextInput::make('icon')->maxLength(255),
                TextInput::make('sort_order')->numeric()->required()->default(0),
                Toggle::make('status')
                    ->label('Active')
                    ->formatStateUsing(fn (?string $state) => $state === 'active')
                    ->dehydrateStateUsing(fn (bool $state) => $state ? 'active' : 'inactive')
                    ->default(true),
            ]);
    }
}
