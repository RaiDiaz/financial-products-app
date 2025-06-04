/**
 * ProductFormComponent
 * 
 * Este componente maneja tanto la creación como la edición de productos.
 * Incluye la inicialización del formulario, validaciones, carga de datos y lógica de envío.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { map, switchMap, of  } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  form!: FormGroup;
  submitting = false;
  isEdit = false;

  /**
   * El constructor inyecta los servicios necesarios para el manejo del formulario y navegación.
   */
  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Al inicializar el componente:
   * - Construye el formulario con sus validadores.
   * - Suscribe los cambios en la fecha de lanzamiento para validar la fecha de revisión.
   * - Verifica si se está editando un producto existente según los parámetros de la ruta.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{value: '', disabled: false}, [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idExistsValidator()]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.releaseDateValidator()]],
      date_revision: ['', [Validators.required, this.revisionDateValidator()]]
    });

    this.form.get('date_release')?.valueChanges.subscribe(() => {
      this.form.get('date_revision')?.updateValueAndValidity();
    });

    // Revisamos si es edición
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (id) {
          this.isEdit = true;
          this.form.get('id')?.disable();
          return this.productService.getProducts().pipe(
            map(products => products.find(p => p.id === id))
          );
        }
        return of(null);
      })
    ).subscribe(product => {
      if (product) {
        this.form.patchValue(product);
      }
    });
  }

  /**
   * Validador asíncrono que verifica si el ID del producto ya existe.
   * Previene la creación de productos con IDs duplicados.
   */
  idExistsValidator(): AsyncValidatorFn {
    return control => {
      if (!control.value) return of(null);
      return this.productService.getProductVerification(control.value).pipe(
        map(exists => exists ? { idExists: true } : null)
      );
    };
  }

  /**
   * Validador que asegura que la fecha de lanzamiento sea hoy o en el futuro.
   */
  releaseDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      const release = new Date(control.value);
      return release >= today ? null : { invalidRelease: true };
    };
  }

  /**
   * Validador que asegura que la fecha de revisión sea exactamente un año después de la fecha de lanzamiento.
   */
  revisionDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const release = new Date(this.form?.get('date_release')?.value);
      if (!release) return null;

      const revision = new Date(control.value);
      const expected = new Date(release);
      expected.setFullYear(expected.getFullYear() + 1);

      return revision.getFullYear() === expected.getFullYear() &&
             revision.getMonth() === expected.getMonth() &&
             revision.getDate() === expected.getDate() ? null : { invalidRevision: true };
    };
  }

  /**
   * Maneja el envío del formulario:
   * - Valida el formulario.
   * - Construye el payload.
   * - Envía la solicitud de creación o actualización según el modo.
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Product = { ...(this.form.getRawValue() as Product) };

    this.submitting = true;

    let request;

    if (this.isEdit) {
      const { id, ...rest } = payload;
      request = this.productService.updateProduct(id, rest);
    } else {
      request = this.productService.addProduct(payload);
    }

    request.subscribe({
      next: () => {
        alert(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Error al guardar');
        this.submitting = false;
      }
    });
  }

  /**
   * Resetea los campos del formulario.
   * - En modo edición, limpia solo los campos editables.
   * - En modo creación, resetea el formulario completo.
   */
  reset() {
    if (this.isEdit) {
      this.form.patchValue({
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: ''
      });

    }else {
      this.form.reset();
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.submitting = false;
  }
}