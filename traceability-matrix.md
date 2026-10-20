# Requirements traceability matrix — sections 1–4.4

| Requirement / area | Test IDs | Automated file | Status / note |
|---|---|---|---|
| Password length and type validation | PW-01–PW-06 | `password.test.js` | PW-01 is expected to expose the intentional boundary defect |
| Booking price calculation | BK-01–BK-09 | `booking.test.js` | BK-03–BK-06 exercise four documented intentional defects / boundaries |
| Cart totals and shipping | CT-01–CT-07 | `cart.test.js` | CT-03 detects case-sensitive discount-code handling |
| Receipt email side effect | CT-08 | `cart.test.js` | Uses Jest mock; checks call count and arguments |
| Discount black-box behavior | DC-01–DC-07 | `discount.test.js` | DC-07 detects undocumented FREE behavior |
| Discount white-box / grey-box branches | DC-08–DC-09 | `discount.test.js` | Covers VIP and combined-discount logic |
| Warehouse functional behavior | INV-01–INV-06 | `inventory.test.js` | Checks restock/pick and non-mutation |
| Warehouse performance requirement | INV-07 | `inventory.test.js`, `inventory.js` | Duplicate detection changed to linear-time sets |
| Warehouse SKU security | INV-08 | `inventory.test.js` | Data-driven invalid-SKU cases |
| Warehouse reliability / immutability | INV-09 | `inventory.test.js` | Failed operation must not mutate original stock |
| REST API health and item retrieval | TC-01–TC-04 | `items.api.spec.ts` | TC-04 is expected to expose 200/null instead of 404 |
| REST API create and update | TC-05, TC-06, TC-08 | `items.api.spec.ts` | Positive and invalid-input coverage |
| REST API quantity validation | TC-07 | `items.api.spec.ts` | Expected to expose acceptance of qty = -1 |
| REST API delete contract | TC-09–TC-10 | `items.api.spec.ts` | TC-09 is expected to expose 200/body instead of 204/empty |
| MiniShop UI v1 and v2 | UI-01–UI-18 | `shop.ui.spec.ts`, `shop2.ui.spec.ts` | Existing separate UI scenarios and reports |
| Flaky UI wait handling | FLAKY-01 | `flaky.ui.spec.ts` | Uses Playwright web-first assertion rather than fixed sleep |
