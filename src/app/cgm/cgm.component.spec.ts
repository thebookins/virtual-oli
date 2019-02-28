import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgmComponent } from './cgm.component';

describe('CgmComponent', () => {
  let component: CgmComponent;
  let fixture: ComponentFixture<CgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
