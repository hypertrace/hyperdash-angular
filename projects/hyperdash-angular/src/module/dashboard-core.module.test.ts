import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type ModelPropertyTypeRegistrationInformation } from '@hypertrace/hyperdash';
import { DashboardCoreModule, MODEL_PROPERTY_TYPES } from './dashboard-core.module';

describe('Dashboard core module', () => {
  const testPropType = {
    type: 'test-prop-type'
  };

  const testPropType2 = {
    type: 'test-prop-type-2'
  };

  @Injectable({
    providedIn: 'root'
  })
  class PropertyTypeProvider implements ModelPropertyTypeRegistrationInformation {
    public readonly type: string = 'injected-test-type';
  }

  test('adds property types to injector', () => {
    TestBed.configureTestingModule({
      imports: [
        DashboardCoreModule.with({
          propertyTypes: [testPropType, testPropType2, PropertyTypeProvider]
        })
      ]
    });

    expect(TestBed.inject(MODEL_PROPERTY_TYPES)).toContainEqual([testPropType, testPropType2, PropertyTypeProvider]);
  });
});
