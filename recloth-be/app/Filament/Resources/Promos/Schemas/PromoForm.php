<?php

namespace App\Filament\Resources\Promos\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PromoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')->required()->maxLength(255),
                Select::make('type')->options(['percent' => 'percent', 'nominal' => 'nominal'])->required(),
                TextInput::make('value')->numeric()->required(),
                TextInput::make('min_purchase')->numeric()->default(0),
                TextInput::make('max_discount')->numeric(),
                TextInput::make('quota')->numeric()->required()->default(0),
                TextInput::make('used_count')->numeric()->default(0),
                DateTimePicker::make('start_at')->required(),
                DateTimePicker::make('end_at')->required(),
                Toggle::make('status')
                    ->formatStateUsing(fn (?string $state) => $state === 'active')
                    ->dehydrateStateUsing(fn (bool $state) => $state ? 'active' : 'inactive')
                    ->default(true),
            ]);
    }
}
