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

### Rule: Vitest `beforeEach` structure
Vitest tests that rely on Angular dependency injection should initialize the fixture in a `beforeEach` that clearly separates (1) mocked dependencies, (2) the `TestBed.configureTestingModule` call, and (3) any shared arrangement/state used by the `it` blocks.
1. **Mocking:** define `vi.fn()`-based implementations or `Mocked<...>` helpers for services, components, pipes etc. that the tested unit depends on.
2. **Config:** call `TestBed.configureTestingModule` with the declarations/providers/etc., referencing the mocks from step 1 via `useValue` or `useFactory` so the testbed mirrors real wiring.
3. **Arrangement:** assign the instance(s) under test (e.g., `service = TestBed.inject(...)`, `fixture = TestBed.createComponent(...)`, `component = fixture.componentInstance`) and any shared state that the `it` cases rely on.

This structure keeps setup predictable and makes it obvious where to adjust dependencies, module configuration, or reused state when tests evolve.

### Rule: Instantiate services/components through `TestBed` in Arrangement
Within a Vitest `beforeEach` that follows the recommended Mocking/Config/Arrangement split, services and components must be created or injected through `TestBed` in the Arrangement section. Replace any `new Service()` or `new Component()` calls with `TestBed.inject(Service)` or `TestBed.createComponent(Component)` so Angular's dependency injection is honored and lifecycle hooks behave as in production.

### Rule: Mocked<> with Pick to the narrow surface
When you wrap a dependency in Vitest's `Mocked<...>` to satisfy the Mocking phase, restrict the mocked surface to the properties the test actually consumes via `Pick<DependencyType, 'foo' | 'bar'>`. This avoids having to stub every method on a dependency and keeps the mock declaration focused:
```
let dependency: Mocked<Pick<DependencyType, 'methodA' | 'propertyB'>>;
```
Only expand the Pick arguments when a test genuinely needs additional members; never mock the full type unless production code under test touches nearly every member.

### Rule: declare const/type/let inside the `describe`
Keep `let` and `type` declarations within the `describe` block that owns their tests instead of hoisting them to the module scope. This keeps shared setup explicit, avoids leaking state between suites, and makes each guard/test clearly scoped:
```
describe('<Something>', () => {
  let subject = ...;
  type SubjectMock = Mocked<...>;
});
```
Only move declarations out of `describe` when they must be reused across multiple suites in the same file, never just for convenience.

### Rule: prefer `toHaveBeenCalledExactlyOnceWith`
Vitest matcher `toHaveBeenCalledExactlyOnceWith` should be used whenever a call is expected exactly once with specific arguments. Replace plain `toHaveBeenCalled` assertions with the more precise matcher when the test already verifies the arguments:
```
expect(dependency.confirm).toHaveBeenCalledExactlyOnceWith('/foo');
```
This documents the contract more accurately and guards against duplicate invocations; keep `toHaveBeenCalled` only for cases where arguments are irrelevant or multiple calls are acceptable.

### Rule: avoid command questions while editing
Do not ask command-related questions while editing files. All necessary commands should be determined from the AGENT rules or project context, not prompted for mid-edit. If you need clarification, ask after finishing the edit instead of embedding questions in the code review or change itself. Additionally, avoid requesting or suggesting terminal operations—any required commands should already be implicit in the AGENT guidance or the project structure. This applies to the chat as well: the AGENT interaction should not contain requests for terminal runs or instructions to execute commands while you are editing the code.

### Rule: avoid using explicit any
Please do not `as any` as it violates the linting rule `@typescript-eslint/no-explicit-any`. Try to use proper typing instead.

### Rule: do not make any unnecessary changes
Do not delete comments or tests, that were in place.
