import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
products: Product[] = [];
    filteredProducts: Product[] = [];
    paginatedProducts: Product[] = [];

    searchControl = new FormControl('');
    loading = true;

    pageSizes = [5, 10, 20];
    pageSize = 5;
    currentPage = 1;
    totalPages = 1;


    constructor(private productsService: ProductsService) {}

    ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = res;
        this.setupPagination();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.filterProducts(value || '');
    });
  }

  filterProducts(searchTerm: string) {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.setupPagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.setupPagination();
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

}
