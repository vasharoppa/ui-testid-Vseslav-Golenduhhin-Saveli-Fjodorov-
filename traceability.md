# Traceability Matrix – MiniShop

| REQ | Test Cases | Automated Tests | Layer | Last Result | Defect |
|---|---|---|---|---|---|
| REQ-L-01 | TC-L-01…03 | UT-01…UT-04 | Unit | PASS | - |
| REQ-L-02 | TC-L-04…06 | UT-05…UT-08 | Unit | FAIL | D-L-01 |
| REQ-L-03 | TC-L-07 | UT-09…UT-10 | Unit | PASS | - |
| REQ-L-04 | TC-L-08 | UT-11…UT-15 | Unit | FAIL | D-L-02 |
| REQ-L-05 | TC-L-09 | UT-16…UT-17 | Unit | FAIL | D-L-03 |
| REQ-L-06 | TC-L-10 | UT-18…UT-20 | Unit | PASS | - |
| REQ-L-07 | TC-L-11 | UT-21…UT-24 | Unit | FAIL | D-L-04 |
| REQ-API-01 | TC-01 | TC-01 | API | PASS | - |
| REQ-API-02 | TC-02, TC-03 | TC-02, TC-03 | API | FAIL | D-A-01 |
| REQ-API-03 | TC-04…06 | TC-04…TC-06 | API | FAIL | D-A-02 |
| REQ-API-04 | TC-07 | TC-07 | API | PASS | - |
| REQ-API-05 | TC-08 | TC-08 | API | PASS | - |
| REQ-API-06 | TC-09, TC-10 | TC-09, TC-10 | API | FAIL | D-A-03 |
| REQ-API-07 | TC-09 | TC-09 | API | FAIL | D-A-03 |
| REQ-API-08 | - | - | API | NOT TESTED | - |
| REQ-UI-10 | UI-15, UI-16 | UI-15, UI-16 [ui], [mobile] | UI | FAIL | D-L-02 (same root cause) |
| REQ-UI-11 | UI-11, UI-12 | UI-11, UI-12 [ui], [mobile] | UI | FAIL | D-L-01 (same root cause) |
| REQ-UI-14 | UI-14 | UI-14 [ui], [mobile] | UI | FAIL | D-L-03 (same root cause) |
| REQ-UI-18 | UI-18 | UI-18 [ui], [mobile] | UI | FAIL | D-L-04 (same root cause) |