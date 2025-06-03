import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, HttpClientTestingModule],
      providers: [ProductsService, 
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
            paramMap: of({ get: () => '123' }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
