import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSwitchComponent } from './btn-switch.component';

describe('BtnSwitchComponent', () => {
  let component: BtnSwitchComponent;
  let fixture: ComponentFixture<BtnSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BtnSwitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
