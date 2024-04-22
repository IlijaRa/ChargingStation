import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehicleAddEditComponent } from './user-vehicle-add-edit.component';

describe('UserVehicleAddEditComponent', () => {
  let component: UserVehicleAddEditComponent;
  let fixture: ComponentFixture<UserVehicleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVehicleAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVehicleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
