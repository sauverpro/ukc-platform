<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::updateOrCreate(
            ['slug' => 'animal-feed'],
            ['name' => 'Animal Feed', 'description' => 'Feed and fodder products']
        );

        // Feed Pellets — variable product (Fr 400 - 650)
        $pellets = Product::updateOrCreate(
            ['slug' => 'feed-pellets'],
            [
                'category_id' => $category->id,
                'name'        => 'Feed Pellets',
                'type'        => ProductType::Variable,
                'base_price'  => 400,
                'stock'       => 0,
                'is_active'   => true,
            ]
        );
        $pellets->variants()->delete();
        $pellets->variants()->createMany([
            ['name' => 'Small pack',  'price' => 400, 'stock' => 100],
            ['name' => 'Medium pack', 'price' => 525, 'stock' => 100],
            ['name' => 'Large pack',  'price' => 650, 'stock' => 100],
        ]);

        // Fodder Silage — simple product (Fr 120)
        Product::updateOrCreate(
            ['slug' => 'fodder-silage'],
            [
                'category_id' => $category->id,
                'name'        => 'Fodder Silage',
                'type'        => ProductType::Simple,
                'base_price'  => 120,
                'stock'       => 200,
                'is_active'   => true,
            ]
        );

        // Hydroponic Green Fodder — simple product (Fr 250)
        Product::updateOrCreate(
            ['slug' => 'hydroponic-green-fodder'],
            [
                'category_id' => $category->id,
                'name'        => 'Hydroponic Green Fodder',
                'type'        => ProductType::Simple,
                'base_price'  => 250,
                'stock'       => 200,
                'is_active'   => true,
            ]
        );
    }
}
