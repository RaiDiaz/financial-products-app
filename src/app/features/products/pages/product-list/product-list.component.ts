import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    products: Product[] = [];
    loading = true;

    constructor(private productsService: ProductsService) {}

    ngOnInit(): void {
      this.productsService.getProducts().subscribe({
        next: (res:any) => { this.products = res; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }

}
