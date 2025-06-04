/**
 * ProductListComponent
 * 
 * Componente encargado de listar, buscar, editar y eliminar productos.
 * Incluye lógica de paginación, filtrado y manejo de confirmación de eliminación.
 */
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

  /**
   * Constructor que inyecta los servicios necesarios para obtener los productos y manejar la navegación.
   */
  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  /**
   * Al inicializar:
   * - Obtiene los productos desde el servicio.
   * - Inicializa la paginación.
   * - Suscribe al campo de búsqueda para filtrar productos de manera reactiva.
   */
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

  /**
   * Filtra los productos en base al término de búsqueda ingresado.
   * Actualiza la paginación luego de filtrar.
   */
  filterProducts(searchTerm: string) {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.setupPagination();
  }

  /**
   * Controla la apertura y cierre de los dropdowns individuales para cada producto.
   */
  toggleDropdown(id: string) {
    this.openedDropdown = this.openedDropdown === id ? null : id;
  }

  /**
   * Redirige a la página de edición para el producto seleccionado.
   */
  editProduct(id: string) {
    this.router.navigate(['/edit', id]);
  }

  /**
   * Abre el modal de confirmación de eliminación guardando el ID y nombre del producto a eliminar.
   */
  confirmDelete(id: string, name: string) {
    this.productToDeleteId = id;
    this.productToDeleteName = name;
  }

  /**
   * Cancela la eliminación, limpiando el ID de producto a eliminar.
   */
  cancelDelete() {
    this.productToDeleteId = null;
  }

  /**
   * Elimina el producto seleccionado mediante el servicio.
   * Actualiza la lista de productos y vuelve a aplicar el filtro.
   */
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

  /**
   * Cambia el tamaño de página actual y reinicia la paginación.
   */
  onPageSizeChange() {
    this.currentPage = 1;
    this.setupPagination();
  }

  /**
   * Calcula el total de páginas según el tamaño de página actual y actualiza los datos de la página.
   */
  setupPagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePage();
  }

  /**
   * Actualiza los productos visibles en la página actual.
   */
  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  /**
   * Avanza a la siguiente página si es posible.
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  /**
   * Retrocede a la página anterior si es posible.
   */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }
}