<?php

namespace App\Filament\Resources\Reports\Pages;

use App\Filament\Resources\Reports\ReportResource;
use App\Filament\Resources\Reports\Widgets\ReportStats;
use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListReports extends ListRecords
{
    protected static string $resource = ReportResource::class;

    protected function getHeaderWidgets(): array
    {
        return [
            ReportStats::class,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('export_excel')
                ->label('Export Excel')
                ->action(function (): StreamedResponse {
                    $filename = 'reports-'.now()->format('Ymd-His').'.csv';
                    $headers = ['Content-Type' => 'text/csv'];

                    return response()->streamDownload(function () {
                        $out = fopen('php://output', 'w');
                        fputcsv($out, ['id', 'reporter', 'reported_user', 'reason', 'status', 'created_at']);

                        \App\Models\Report::query()->with(['reporter', 'reportedUser'])->chunkById(200, function ($rows) use ($out) {
                            foreach ($rows as $row) {
                                fputcsv($out, [
                                    $row->id,
                                    $row->reporter?->name,
                                    $row->reportedUser?->name,
                                    $row->reason,
                                    $row->status,
                                    $row->created_at,
                                ]);
                            }
                        });

                        fclose($out);
                    }, $filename, $headers);
                }),
            Action::make('export_pdf')
                ->label('Export PDF')
                ->action(function (): StreamedResponse {
                    $filename = 'reports-'.now()->format('Ymd-His').'.txt';

                    return response()->streamDownload(function () {
                        echo "Laporan Recloth\n\n";
                        \App\Models\Report::query()->with(['reporter', 'reportedUser'])->latest()->limit(500)->get()->each(function ($row) {
                            echo "#{$row->id} | {$row->reporter?->name} -> {$row->reportedUser?->name} | {$row->reason} | {$row->status}\n";
                        });
                    }, $filename, ['Content-Type' => 'text/plain']);
                }),
        ];
    }
}
