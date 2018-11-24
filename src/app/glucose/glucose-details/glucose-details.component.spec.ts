import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseDetailsComponent } from './glucose-details.component';

describe('GlucoseDetailsComponent', () => {
  let component: GlucoseDetailsComponent;
  let fixture: ComponentFixture<GlucoseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlucoseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlucoseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
