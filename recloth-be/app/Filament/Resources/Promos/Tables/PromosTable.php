<?php

namespace App\Filament\Resources\Promos\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Table;

class PromosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->searchable(),
                TextColumn::make('type')->badge(),
                TextColumn::make('value'),
                TextColumn::make('used_count'),
                TextColumn::make('quota'),
                TextColumn::make('status')->badge(),
                TextColumn::make('start_at')->dateTime('d M Y'),
                TextColumn::make('end_at')->dateTime('d M Y'),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'active' => 'active',
                    'inactive' => 'inactive',
                ]),
                Filter::make('active_period')
                    ->query(fn (Builder $query) => $query
                        ->where('start_at', '<=', now())
                        ->where('end_at', '>=', now())),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('toggle')
                    ->action(fn ($record) => $record->update([
                        'status' => $record->status === 'active' ? 'inactive' : 'active',
                    ])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
