import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { debounceTime, map, switchMap, of  } from 'rxjs';
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  idExistsValidator(): AsyncValidatorFn {
    return control => {
      if (!control.value) return of(null);
      return this.productService.getProductVerification(control.value).pipe(
        map(exists => exists ? { idExists: true } : null)
      );
    };
  }

  releaseDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      const release = new Date(control.value);
      return release >= today ? null : { invalidRelease: true };
    };
  }

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

  reset() {
    this.form.reset();
  }
}