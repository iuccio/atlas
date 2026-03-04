# Jasmine to Vitest migration guide

## Base example for a service test

```
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';
describe('Calculator', () => {
  let service: Calculator;
  beforeEach(() => {
    // Injects the Calculator service which is available to Angular
    // because the service uses `providedIn: 'root'`
    service = TestBed.inject(Calculator);
  });
  it('adds two numbers', () => {
    expect(service.add(1, 2)).toBe(3);
  });
  it('subtracts two numbers', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

### Example for mocking service dependencies
If already a jasmine spy object was used to mock a service dependency, the equivalent in Vitest would be to create a manual mock using `vi.fn()`.
This allows you to define the behavior of the mocked methods while ensuring type safety with `Mocked`. Here's how you can do it:
```
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

describe('OrderTotal', () => {
  let service: OrderTotal;
  
  // Vitest's `Mocked` utility type ensures the stub is type-safe,
  // while `vi.fn()` creates a mock function for each method
  let taxCalculatorStub: Mocked<TaxCalculator>;
  
  beforeEach(() => {
    taxCalculatorStub = {
      calculate: vi.fn(),
    };
    // `mockReturnValue` sets a controlled return value for the stub
    taxCalculatorStub.calculate.mockReturnValue(5);
    TestBed.configureTestingModule({
      // The `providers` array accepts a provider object where `provide`
      // specifies the dependency to replace and `useValue` defines the stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });
  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

### Rule: spyOn(...).and.callThrough() → vi.spyOn(...)
If already jasmine spyOn was used to mock a service dependency, the equivalent in Vitest would be to use `vi.spyOn()` to create a spy on the method of the service.
The `.and.callThrough()` suffix must be dropped because call-through is the default behaviour of `vi.spyOn()`.
```
// jasmine variant
spyOn(apiService, '<some method>').and.callThrough();
// vitest variant (as callThrough is the default behaviour)
vi.spyOn(apiService, '<same method>');
```

### Rule: spyOn(...) → vi.spyOn(...).mockImplementation(...)
If a plain jasmine `spyOn` exists (without `.and.callThrough()`), it must be replaced with `vi.spyOn()` and a `mockImplementation` that returns a no-operation empty value matching the method's return type:

| Return type | mockImplementation |
|---|---|
| `Observable<any>` | `() => EMPTY` |
| `Promise<any>` | `() => Promise.resolve()` |
| `void` / `undefined` | `() => {}` |
| `boolean` | `() => false` |
| `number` | `() => 0` |
| `string` | `() => ''` |
| `object` / custom type | `() => ({})` |
| `array` | `() => []` |

`EMPTY` must be imported from `rxjs` when used.

### Rule: toHaveBeenCalledOnceWith → toHaveBeenCalledExactlyOnceWith
Jasmine's `toHaveBeenCalledOnceWith` matcher does not exist in Vitest. Every occurrence must be replaced with Vitest's `toHaveBeenCalledExactlyOnceWith`.
```
// jasmine variant
expect(apiService.get).toHaveBeenCalledOnceWith('/some/path');
// vitest variant
expect(apiService.get).toHaveBeenCalledExactlyOnceWith('/some/path');
```
