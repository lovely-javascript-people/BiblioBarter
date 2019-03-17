import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerProfilePage } from './peer-profile.page';

describe('PeerProfilePage', () => {
  let component: PeerProfilePage;
  let fixture: ComponentFixture<PeerProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
