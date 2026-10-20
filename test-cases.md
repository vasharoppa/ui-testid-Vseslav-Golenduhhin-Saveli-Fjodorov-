# Test cases — Software Systems Testing (sections 1–4.4)

Repository: https://github.com/vasharoppa/ui-testid-Vseslav-Golenduhhin-Saveli-Fjodorov-

## 1. Password validation (`password.test.js`)

| ID | Scenario | Input | Expected result |
|---|---|---|---|
| PW-01 | Minimum valid length | `abcdefgh` | `true` |
| PW-02 | More than minimum length | `abcdefghi` | `true` |
| PW-03 | Too short | `abc123` | `false` |
| PW-04 | Empty password | `''` | `false` |
| PW-05 | Spaces only | nine spaces | `false` |
| PW-06 | Non-string input | `12345678` | `false` |

## 2. Hotel booking (`booking.test.js`)

| ID | Scenario | Input | Expected result |
|---|---|---|---|
| BK-01 | One night, one guest | (1, 1) | 50 EUR |
| BK-02 | Extra guests are charged per night | (2, 3) | 140 EUR |
| BK-03 | Maximum stay is inclusive | (30, 1) | 1500 EUR |
| BK-04 | Guest count defaults to one | (2) | 100 EUR |
| BK-05 | WEEKEND discount starts at two nights | (2, 1, WEEKEND) | 85 EUR |
| BK-06 | Discount code is case-insensitive | (2, 1, weekend) | 85 EUR |
| BK-07 | Zero nights is rejected | (0, 1) | Throws an error |
| BK-08 | More than four guests is rejected | (1, 5) | Throws an error |
| BK-09 | Fractional nights are rejected | (1.5, 1) | Throws an error |

## 3. Cart totals and email mock (`cart.test.js`)

| ID | Scenario | Expected result |
|---|---|---|
| CT-01 | Empty cart | 0 EUR |
| CT-02 | Price multiplied by quantity; shipping below 100 EUR | 35 EUR for 3 × 10 EUR |
| CT-03 | STUDENT10 discount | 90 EUR for a 100 EUR subtotal |
| CT-04 | Shipping charged below 100 EUR | 45 EUR for a 40 EUR subtotal |
| CT-05 | Free shipping at exactly 100 EUR | 100 EUR |
| CT-06 | Non-array input | Throws TypeError |
| CT-07 | Final amount is rounded to cents | 17.35 EUR for the test input |
| CT-08 | Receipt uses order email and formatted message | Mock called once with expected arguments |

## 4. Discount calculation (`discount.test.js`)

| ID | Scenario | Expected result |
|---|---|---|
| DC-01 | No code | Original price |
| DC-02 | Unknown code | Original price |
| DC-03 | STUDENT10 | 10% discount |
| DC-04 | WELCOME at or above 20 EUR | 5 EUR off |
| DC-05 | WELCOME below 20 EUR | Original price |
| DC-06 | Result rounding | Two decimal places |
| DC-07 | FREE is not a documented code | Original price |
| DC-08 | VIP branch, no promotion | 20% off, according to the implementation's additional branch |
| DC-09 | VIP and STUDENT10 combined | 72 EUR from 100 EUR |

## 5. Warehouse inventory (`inventory.test.js`)

| ID | Requirement | Expected result |
|---|---|---|
| INV-01 | REQ-01 restock existing SKU | Quantity is increased |
| INV-02 | Unknown SKU in delivery | SKU is added |
| INV-03 | Restock returns a new object | Original stock is unchanged |
| INV-04 | Pick valid quantity | New stock quantity is reduced |
| INV-05 | Pick more than available | Throws an error |
| INV-06 | Pick unknown SKU | Throws an error |
| INV-07 | Performance | 20,000 items processed in under 100 ms |
| INV-08 | REQ-07 invalid SKU data | Each invalid SKU is rejected |
| INV-09 | REQ-08 failed restock | Original stock remains unchanged |

## 6. Inventory REST API (`items.api.spec.ts`)

| ID | Endpoint/scenario | Expected result |
|---|---|---|
| TC-01 | GET /items | 200 and two initial items |
| TC-02 | GET /health | 200 and status `ok` |
| TC-03 | GET /items/1 | 200 and item with ID 1 |
| TC-04 | GET /items/999 | 404 and not-found error |
| TC-05 | POST /items with valid data | 201 and created item |
| TC-06 | POST /items with invalid SKU | 400 |
| TC-07 | POST /items with negative quantity | 400 |
| TC-08 | PUT /items/1 | 200 and updated item |
| TC-09 | DELETE /items/1 | 204 with empty response |
| TC-10 | DELETE /items/999 | 404 |

Tests TC-04, TC-07 and TC-09 are designed to reveal known defects in the supplied API implementation; a failure is evidence to report, not a reason to weaken the expected result.
