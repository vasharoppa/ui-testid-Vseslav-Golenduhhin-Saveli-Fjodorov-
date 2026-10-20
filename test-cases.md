# Test Case Specification – MiniShop

## A. Business logic (shop-logic.js) – executed as Jest unit tests

| TC | REQ | Prio | Input | Expected | Automated as |
|---|---|---|---|---|---|
| TC-L-01 | REQ-L-01 | High | query: '' | Returns all 4 products | UT-01 |
| TC-L-02 | REQ-L-01 | High | query: 'mouse' | Returns 1 product ('Wireless Mouse') | UT-02 |
| TC-L-03 | REQ-L-01 | High | query: 'tablet' | Returns empty array [] | UT-03 |
| TC-L-04 | REQ-L-02 | High | mode: 'name' | Sorted A→Z by name | UT-05 |
| TC-L-05 | REQ-L-02 | High | mode: 'price-asc' | First item price is 24.50 | UT-06 |
| TC-L-06 | REQ-L-02 | High | mode: 'price-desc' | First item price is 249.00 | UT-07 |
| TC-L-07 | REQ-L-03 | High | price: 39.00, qty: 2 | 78.00 | UT-09 |
| TC-L-08 | REQ-L-04 | High | rows: [39.00, 24.50], rate: 0.10 | { subtotal: 63.50, discount: 6.35, total: 57.15 } | UT-13 |
| TC-L-09 | REQ-L-05 | High | qty: 0 | Returns 1 | UT-17 |
| TC-L-10 | REQ-L-06 | Medium | code: 'SAVE10' | Returns 0.10 | UT-18 |
| TC-L-11 | REQ-L-07 | High | email: 'mari@example' | Returns error object with email property | UT-24 |

## B. Inventory API (server.js) – executed as Playwright API tests

Precondition for all: server running, POST /reset done (2 items: id 1 'A-1' qty 5, id 2 'B-2' qty 0).

| TC | REQ | Prio | Request (method, path, body) | Expected status | Expected body | Type |
|---|---|---|---|---|---|---|
| TC-01 | REQ-API-01 | High | GET /items | 200 | Array of 2 items | Positive |
| TC-02 | REQ-API-02 | High | GET /items/1 | 200 | Item object with id 1 | Positive |
| TC-03 | REQ-API-02 | High | GET /items/999 | 404 | { error: 'not found' } | Negative |
| TC-04 | REQ-API-03 | High | POST /items { sku: 'C-3', qty: 10 } | 201 | Created item with new id | Positive |
| TC-05 | REQ-API-03 | High | POST /items { sku: 'C-4', qty: 0 } | 201 | Created item with qty 0 | Boundary |
| TC-06 | REQ-API-03 | High | POST /items { sku: 'C-5', qty: -1 } | 400 | { error: 'invalid qty' } | Boundary |
| TC-07 | REQ-API-04 | Medium | POST /items { sku: 'bad sku!', qty: 5 } | 400 | { error: 'invalid sku' } | Negative |
| TC-08 | REQ-API-05 | High | PUT /items/1 { sku: 'A-1-UPD', qty: 15 } | 200 | Updated item object | Positive |
| TC-09 | REQ-API-06 | High | DELETE /items/1 | 204 | Empty response body | Positive |
| TC-10 | REQ-API-06 | High | DELETE /items/999 | 404 | { error: 'not found' } | Negative |