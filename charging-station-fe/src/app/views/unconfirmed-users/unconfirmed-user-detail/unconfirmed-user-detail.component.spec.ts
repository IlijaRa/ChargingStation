import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedUserDetailComponent } from './unconfirmed-user-detail.component';

describe('UnconfirmedUserDetailComponent', () => {
  let component: UnconfirmedUserDetailComponent;
  let fixture: ComponentFixture<UnconfirmedUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnconfirmedUserDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnconfirmedUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
