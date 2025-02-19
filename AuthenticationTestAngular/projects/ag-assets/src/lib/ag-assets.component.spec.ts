import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgAssetsComponent } from './ag-assets.component';

describe('AgAssetsComponent', () => {
  let component: AgAssetsComponent;
  let fixture: ComponentFixture<AgAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
