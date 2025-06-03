import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  searchControl = new FormControl('');
  loading = true;
  openedDropdown: string | null = null;

  pageSizes = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  productToDeleteId: string | null = null;
  productToDeleteName: string = '';

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

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

  toggleDropdown(id: string) {
    this.openedDropdown = this.openedDropdown === id ? null : id;
  }

  editProduct(id: string) {
    this.router.navigate(['/edit', id]);
  }

  confirmDelete(id: string, name: string) {
    this.productToDeleteId = id;
    this.productToDeleteName = name;
  }

  cancelDelete() {
    this.productToDeleteId = null;
  }

  deleteProduct() {
    if (!this.productToDeleteId) return;

    this.productsService.deleteProduct(this.productToDeleteId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.productToDeleteId);
        this.filterProducts(this.searchControl.value || '');
        this.productToDeleteId = null;
      },
      error: () => {
        alert('Error al eliminar');
        this.productToDeleteId = null;
      }
    });
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