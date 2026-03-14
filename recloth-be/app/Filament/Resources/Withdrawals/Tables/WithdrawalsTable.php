<?php

namespace App\Filament\Resources\Withdrawals\Tables;

use App\Services\NotificationService;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class WithdrawalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('ID'),
                TextColumn::make('user.name')->label('Seller')->searchable(),
                TextColumn::make('amount')->money('IDR'),
                TextColumn::make('bank_name'),
                TextColumn::make('status')->badge(),
                TextColumn::make('created_at')->dateTime('d M Y H:i'),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'pending' => 'pending',
                    'processing' => 'processing',
                    'done' => 'done',
                    'failed' => 'failed',
                ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('approve')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(function ($record) {
                        $record->update(['status' => 'done', 'processed_at' => now()]);

                        app(NotificationService::class)->send(
                            $record->user,
                            'withdrawal_done',
                            'Withdrawal disetujui',
                            'Permintaan withdrawal Anda telah disetujui.',
                            ['withdrawal_id' => $record->id]
                        );
                    }),
                Action::make('reject')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(function ($record) {
                        DB::transaction(function () use ($record) {
                            $wallet = $record->user->wallet;
                            if ($wallet) {
                                $wallet->balance += $record->amount;
                                $wallet->save();
                            }

                            $record->update(['status' => 'failed', 'processed_at' => now()]);
                        });

                        app(NotificationService::class)->send(
                            $record->user,
                            'withdrawal_failed',
                            'Withdrawal ditolak',
                            'Permintaan withdrawal Anda ditolak, saldo dikembalikan.',
                            ['withdrawal_id' => $record->id]
                        );
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
