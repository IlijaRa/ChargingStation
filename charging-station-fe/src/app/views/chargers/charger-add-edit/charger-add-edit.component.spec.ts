import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerAddEditComponent } from './charger-add-edit.component';

describe('ChargerAddEditComponent', () => {
  let component: ChargerAddEditComponent;
  let fixture: ComponentFixture<ChargerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargerAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
