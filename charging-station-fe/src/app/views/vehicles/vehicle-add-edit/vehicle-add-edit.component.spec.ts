import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddEditComponent } from './vehicle-add-edit.component';

describe('VehicleAddEditComponent', () => {
  let component: VehicleAddEditComponent;
  let fixture: ComponentFixture<VehicleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
