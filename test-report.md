# Testing report — assignment sections 1–4.4

## Scope

I completed and organized the automated tests for password validation, hotel booking prices, shopping-cart totals, receipt email mocking, discount calculation, warehouse inventory, and the inventory REST API. I also added a test-case catalogue and requirements traceability matrix.

## Work completed

- Expanded password tests to cover minimum length, short/empty values, spaces-only values, and non-string input.
- Added booking boundary, extra-guest, default-guest, discount-threshold, case-insensitivity, and invalid-input tests.
- Added cart subtotal/shipping/discount/type/rounding tests and a Jest mock test for the receipt email service.
- Added black-box, white-box, and grey-box discount tests.
- Added inventory functional, SKU validation, immutability, and performance tests.
- Optimized duplicate-SKU detection to use sets, avoiding the previous nested-loop algorithm.
- Expanded REST API tests to TC-01–TC-10.
- Added `test-cases.md` and `traceability-matrix.md`.

## Defects intentionally exposed by tests

The supplied practice code contains known defects, and some tests are deliberately expected to fail until the implementation is fixed:

1. Password validation rejects exactly eight characters although the specification says eight is valid.
2. Booking validation rejects 30 nights, does not default guests to one, applies WEEKEND only above two nights, and compares the discount code case-sensitively.
3. Cart discount handling compares against lowercase `student10` instead of the specified `STUDENT10`.
4. The discount implementation grants an undocumented FREE discount.
5. API GET for an unknown item returns a successful response with null instead of 404.
6. API quantity validation accepts -1.
7. API DELETE returns 200 and a response body instead of 204 with no body.

The test expectations have not been weakened to make these defects appear to pass.

## Validation limits

The GitHub Actions workflow for the UI suite has a recent successful run on the main branch. That workflow runs Playwright UI tests, not the full Jest and API test suites. I could not execute the entire repository locally in this environment, so I am not claiming a locally verified all-green run. The intentional defect tests should be interpreted as defect evidence rather than automatically as a failure of the test design.

## How to run

Install dependencies, then run:

```bash
npm ci
npm test
npm run coverage
npx playwright test --project=api
npx playwright test --project=ui --project=mobile
```

## Conclusion

The requested testing artifacts through section 4.4 are documented, and the automated test suite now covers the principal functional, boundary, security, reliability, mocking, and performance requirements. Remaining failures that correspond to the defects listed above should be recorded and discussed in the final submission rather than hidden.
