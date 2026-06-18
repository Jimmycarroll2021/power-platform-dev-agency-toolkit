# QA Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Tester:** _________________________________
> **Environment:** [ Test / UAT / Production ]
> **Build Version:** _________________________________

---

## 1. Functional Testing

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 1.1 | Create record | Record created with all fields | [ ] | |
| 1.2 | Read/View record | All data displayed correctly | [ ] | |
| 1.3 | Update record | Changes saved successfully | [ ] | |
| 1.4 | Delete/Deactivate record | Record status updated correctly | [ ] | |
| 1.5 | Search functionality | Relevant results returned | [ ] | |
| 1.6 | Filter functionality | Filtered results accurate | [ ] | |
| 1.7 | Sort functionality | Records sorted correctly | [ ] | |
| 1.8 | Business rules execute correctly | Fields show/hide/set as designed | [ ] | |
| 1.9 | Form validation works | Invalid data rejected with message | [ ] | |
| 1.10 | Required field validation | Empty required fields flagged | [ ] | |
| 1.11 | Lookup fields populate correctly | Related records selectable | [ ] | |
| 1.12 | Related records display correctly | Sub-grids/related items accurate | [ ] | |
| 1.13 | Calculated fields update correctly | Values recalculate on change | [ ] | |
| 1.14 | Rollup fields calculate correctly | Aggregations accurate | [ ] | |

---

## 2. Integration Testing

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 2.1 | Inbound integration works | External data received correctly | [ ] | |
| 2.2 | Outbound integration works | Data sent correctly to external system | [ ] | |
| 2.3 | API authentication works | No auth errors | [ ] | |
| 2.4 | API timeout handling | Graceful timeout with retry | [ ] | |
| 2.5 | API error handling | Errors caught and logged | [ ] | |
| 2.6 | Data transformation correct | Data format converted properly | [ ] | |
| 2.7 | Connection references work | Environment-specific connections active | [ ] | |
| 2.8 | Custom connector operations | All operations return expected data | [ ] | |
| 2.9 | Webhook handling | Webhook events processed correctly | [ ] | |
| 2.10 | End-to-end flow completes | Full business process works | [ ] | |

---

## 3. Security Testing

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 3.1 | User with Role A sees correct data | Only authorized records visible | [ ] | |
| 3.2 | User with Role B sees different data | Appropriate data for role | [ ] | |
| 3.3 | Unauthorized access blocked | Access denied for restricted data | [ ] | |
| 3.4 | Field security works | Sensitive fields hidden/uneditable | [ ] | |
| 3.5 | No data exposure in URLs | URLs don't contain sensitive data | [ ] | |
| 3.6 | Session timeout works | User logged out after inactivity | [ ] | |
| 3.7 | Authentication required | Anonymous users can't access secure data | [ ] | |
| 3.8 | Audit trail records key actions | All actions logged | [ ] | |
| 3.9 | PII handled appropriately | Personal data masked/secured | [ ] | |
| 3.10 | SQL injection attempt blocked | Input sanitized | [ ] | |
| 3.11 | XSS attempt blocked | Script injection prevented | [ ] | |

---

## 4. Performance Testing

| # | Test Case | Target | Actual | Status |
|---|----------|--------|--------|--------|
| 4.1 | App initial load time | < 3 sec | | [ ] |
| 4.2 | App subsequent load time | < 2 sec | | [ ] |
| 4.3 | Screen navigation time | < 1 sec | | [ ] |
| 4.4 | Search response time | < 2 sec | | [ ] |
| 4.5 | Form save time | < 3 sec | | [ ] |
| 4.6 | Flow execution time | < 30 sec | | [ ] |
| 4.7 | Report/dashboard load | < 5 sec | | [ ] |
| 4.8 | List view with 1000+ records | No delegation errors | [ ] | |
| 4.9 | Concurrent users (10) | No degradation | [ ] | |
| 4.10 | Mobile app performance | < 5 sec load | [ ] | |

---

## 5. UAT (User Acceptance Testing)

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | UAT test cases prepared and reviewed | [ ] | |
| 5.2 | UAT environment ready | [ ] | |
| 5.3 | Test data prepared | [ ] | |
| 5.4 | Business users trained on UAT process | [ ] | |
| 5.5 | All test cases executed | [ ] | |
| 5.6 | Critical defects resolved | [ ] | |
| 5.7 | High defects resolved or accepted | [ ] | |
| 5.8 | UAT sign-off obtained | [ ] | |
| 5.9 | Business users confirm solution meets needs | [ ] | |
| 5.10 | Outstanding issues documented with plan | [ ] | |

---

## 6. Regression Testing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Previous release features still work | [ ] | |
| 6.2 | Existing integrations unaffected | [ ] | |
| 6.3 | Existing reports still accurate | [ ] | |
| 6.4 | Security roles unchanged for existing users | [ ] | |
| 6.5 | Data integrity maintained | [ ] | |
| 6.6 | Performance not degraded | [ ] | |
| 6.7 | Mobile experience unaffected | [ ] | |
| 6.8 | Browser compatibility maintained | [ ] | |

---

## 7. Accessibility Testing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Keyboard navigation works | [ ] | |
| 7.2 | Screen reader compatible | [ ] | |
| 7.3 | Color contrast meets WCAG AA | [ ] | |
| 7.4 | Focus indicators visible | [ ] | |
| 7.5 | Form labels associated with inputs | [ ] | |
| 7.6 | Error messages clearly identified | [ ] | |
| 7.7 | Page works at 200% zoom | [ ] | |

---

## 8. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| QA Lead | | [ ] Approved | |
| Product Owner | | [ ] Approved | |
| Solution Architect | | [ ] Approved | |
| Delivery Lead | | [ ] Approved | |

---

## Test Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| Functional | | | | |
| Integration | | | | |
| Security | | | | |
| Performance | | | | |
| UAT | | | | |
| Regression | | | | |
| Accessibility | | | | |
| **TOTAL** | | | | |

**Overall Result:** [ ] PASS / [ ] CONDITIONAL PASS / [ ] FAIL
