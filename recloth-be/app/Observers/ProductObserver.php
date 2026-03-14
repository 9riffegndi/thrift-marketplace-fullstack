<?php

namespace App\Observers;

use App\Models\Product;

class ProductObserver
{
    public function created(Product $product): void
    {
        $this->syncIndex($product);
    }

    public function updated(Product $product): void
    {
        $this->syncIndex($product);
    }

    public function deleted(Product $product): void
    {
        $product->unsearchable();
    }

    private function syncIndex(Product $product): void
    {
        if ($product->status === 'active') {
            $product->searchable();
            return;
        }

        $product->unsearchable();
    }
}
