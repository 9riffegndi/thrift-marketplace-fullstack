<?php

use App\Jobs\CheckTrackingStatus;
use App\Jobs\ProcessAutoComplete;
use App\Jobs\ProcessAutoRefund;
use App\Jobs\ProcessAutoSuspend;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new CheckTrackingStatus())->everySixHours();
Schedule::job(new ProcessAutoRefund())->daily();
Schedule::job(new ProcessAutoComplete())->daily();
Schedule::job(new ProcessAutoSuspend())->daily();
