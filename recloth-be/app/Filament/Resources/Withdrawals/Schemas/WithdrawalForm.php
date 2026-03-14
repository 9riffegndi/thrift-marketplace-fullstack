<?php

namespace App\Filament\Resources\Withdrawals\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class WithdrawalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')->numeric()->disabled()->dehydrated(false),
                TextInput::make('amount')->numeric()->disabled()->dehydrated(false),
                TextInput::make('bank_name')->disabled()->dehydrated(false),
                TextInput::make('account_number')->disabled()->dehydrated(false),
                TextInput::make('account_name')->disabled()->dehydrated(false),
                Select::make('status')
                    ->options([
                        'pending' => 'pending',
                        'processing' => 'processing',
                        'done' => 'done',
                        'failed' => 'failed',
                    ])
                    ->required(),
            ]);
    }
}
