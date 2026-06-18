# QA Checklist Template

> **Project:** _________________________________
> **Version:** _________________________________
> **Date:** _________________________________
> **Tester:** _________________________________
> **Environment:** [ Dev / Test / UAT / Prod ]
> **Overall Status:** [ Pass / Fail / In Progress / Not Started ]

---

## Test Execution Summary

| Category | Total Tests | Passed | Failed | Blocked | Not Run | Pass Rate |
|----------|------------|--------|--------|---------|---------|-----------|
| Functional | | | | | | |
| UI/UX | | | | | | |
| Integration | | | | | | |
| Security | | | | | | |
| Performance | | | | | | |
| Accessibility | | | | | | |
| Mobile | | | | | | |
| Error Handling | | | | | | |
| Data Validation | | | | | | |
| Regression | | | | | | |
| **TOTAL** | | | | | | |

---

## 1. Functional Testing

### 1.1 CRUD Operations

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| FUNC-001 | Create new record | Record created successfully | [ ] | |
| FUNC-002 | Read/view record | All data displayed correctly | [ ] | |
| FUNC-003 | Update record | Changes saved successfully | [ ] | |
| FUNC-004 | Delete record | Record soft-deleted | [ ] | |
| FUNC-005 | Search records | Relevant results returned | [ ] | |
| FUNC-006 | Filter records | Correct filtered results | [ ] | |
| FUNC-007 | Sort records | Records sorted correctly | [ ] | |
| FUNC-008 | Bulk operations | Multiple records processed | [ ] | |

### 1.2 Business Rules

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| FUNC-009 | Business rule - field validation | Error shown for invalid input | [ ] | |
| FUNC-010 | Business rule - auto-populate | Fields auto-populated correctly | [ ] | |
| FUNC-011 | Business rule - hide/show fields | Conditional visibility works | [ ] | |
| FUNC-012 | Business rule - required fields | Validation enforced | [ ] | |

### 1.3 Workflow Testing

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| FUNC-013 | Trigger flow on create | Flow executes on record creation | [ ] | |
| FUNC-014 | Trigger flow on update | Flow executes on record update | [ ] | |
| FUNC-015 | Scheduled flow | Flow runs at scheduled time | [ ] | |
| FUNC-016 | Manual flow | Flow triggers on button click | [ ] | |
| FUNC-017 | Flow conditions | Branching logic works correctly | [ ] | |

> **DO NOT:** Test flows only in the editor. Always test with real data and under real conditions. Flow editor testing does not validate trigger behavior or connection permissions.

---

## 2. UI/UX Testing

### 2.1 Layout and Design

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| UI-001 | Layout matches approved design | Pixel-perfect alignment | [ ] | |
| UI-002 | Color scheme consistent | All colors match design system | [ ] | |
| UI-003 | Typography consistent | Fonts, sizes match specification | [ ] | |
| UI-004 | Spacing and padding correct | Consistent spacing throughout | [ ] | |
| UI-005 | Logo and branding correct | Client branding applied | [ ] | |

### 2.2 Navigation

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| UI-006 | Navigation menu functional | All links work correctly | [ ] | |
| UI-007 | Back button works | Returns to previous screen | [ ] | |
| UI-008 | Deep linking works | Direct URLs open correct screen | [ ] | |
| UI-009 | Breadcrumbs present (if applicable) | Navigation trail shown | [ ] | |

### 2.3 Usability

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| UI-010 | Form completion intuitive | Users can complete without help | [ ] | |
| UI-011 | Error messages clear | Users understand what went wrong | [ ] | |
| UI-012 | Help text available | Contextual help where needed | [ ] | |
| UI-013 | Loading states visible | Users know when processing | [ ] | |
| UI-014 | Empty states handled | Friendly message when no data | [ ] | |

---

## 3. Integration Testing

### 3.1 API Integrations

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| INT-001 | Successful API call | Data returned correctly | [ ] | |
| INT-002 | API timeout handling | Graceful timeout message | [ ] | |
| INT-003 | API error handling | Error captured and logged | [ ] | |
| INT-004 | Authentication refresh | Token refresh works seamlessly | [ ] | |
| INT-005 | Large payload handling | Large data processed without error | [ ] | |

### 3.2 Data Integration

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| INT-006 | Data sync inbound | External data appears in Dataverse | [ ] | |
| INT-007 | Data sync outbound | Dataverse data sent externally | [ ] | |
| INT-008 | Data transformation | Data transformed correctly | [ ] | |
| INT-009 | Duplicate handling | Duplicates prevented or merged | [ ] | |

### 3.3 Connector Testing

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| INT-010 | All connections valid | No broken connections | [ ] | |
| INT-011 | Connection references work | Environment-specific connections | [ ] | |
| INT-012 | Custom connector operations | All operations return expected data | [ ] | |

---

## 4. Security Testing

### 4.1 Authentication

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| SEC-001 | Valid login | User authenticated successfully | [ ] | |
| SEC-002 | Invalid credentials | Access denied, appropriate message | [ ] | |
| SEC-003 | MFA enforcement | MFA prompt shown (if configured) | [ ] | |
| SEC-004 | Session timeout | User logged out after inactivity | [ ] | |
| SEC-005 | SSO works | Seamless login via SSO | [ ] | |

### 4.2 Authorization

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| SEC-006 | Role-based access | Users see only authorized data | [ ] | |
| SEC-007 | Record-level security | Users access only their records | [ ] | |
| SEC-008 | Field-level security | Sensitive fields hidden/uneditable | [ ] | |
| SEC-009 | Admin access | Admins have full access | [ ] | |

### 4.3 Data Security

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| SEC-010 | PII masking | Personal data masked appropriately | [ ] | |
| SEC-011 | Data not in URL | No sensitive data in URLs | [ ] | |
| SEC-012 | Audit logging | All access logged | [ ] | |
| SEC-013 | Data export restricted | Export controlled by permissions | [ ] | |

---

## 5. Performance Testing

| Test ID | Test Case | Target | Actual | Status | Notes |
|---------|----------|--------|--------|--------|-------|
| PERF-001 | App load time (initial) | < 3 seconds | | [ ] | |
| PERF-002 | App load time (subsequent) | < 2 seconds | | [ ] | |
| PERF-003 | Screen navigation | < 1 second | | [ ] | |
| PERF-004 | Search response | < 2 seconds | | [ ] | |
| PERF-005 | Form save | < 3 seconds | | [ ] | |
| PERF-006 | Flow execution | < 30 seconds | | [ ] | |
| PERF-007 | Report generation | < 10 seconds | | [ ] | |
| PERF-008 | Dashboard load | < 5 seconds | | [ ] | |
| PERF-009 | Concurrent users (10) | No degradation | | [ ] | |
| PERF-010 | Concurrent users (50) | < 20% degradation | | [ ] | |
| PERF-011 | Large dataset (10k+ records) | Delegation works | | [ ] | |
| PERF-012 | Mobile app performance | < 5 seconds load | | [ ] | |

---

## 6. Accessibility Testing

| Test ID | Test Case | Standard | Status | Notes |
|---------|----------|----------|--------|-------|
| A11Y-001 | Keyboard navigation | WCAG 2.1 | [ ] | Tab order logical |
| A11Y-002 | Screen reader compatibility | WCAG 2.1 | [ ] | Labels, roles defined |
| A11Y-003 | Color contrast | WCAG AA | [ ] | Ratio >= 4.5:1 |
| A11Y-004 | Focus indicators | WCAG 2.1 | [ ] | Visible focus states |
| A11Y-005 | Alternative text for images | WCAG 2.1 | [ ] | Descriptive alt text |
| A11Y-006 | Form labels | WCAG 2.1 | [ ] | All inputs labeled |
| A11Y-007 | Error identification | WCAG 2.1 | [ ] | Errors clearly identified |
| A11Y-008 | Zoom compatibility (200%) | WCAG 2.1 | [ ] | No loss of function |

---

## 7. Mobile Testing

| Test ID | Test Case | Device/Browser | Status | Notes |
|---------|----------|---------------|--------|-------|
| MOB-001 | iOS Safari | iPhone 14 | [ ] | |
| MOB-002 | iOS Chrome | iPhone 14 | [ ] | |
| MOB-003 | Android Chrome | Samsung S23 | [ ] | |
| MOB-004 | Tablet iOS | iPad Pro | [ ] | |
| MOB-005 | Tablet Android | Samsung Tab | [ ] | |
| MOB-006 | Responsive layout | All devices | [ ] | |
| MOB-007 | Touch targets | All devices | [ ] | Min 44x44px |
| MOB-008 | Offline functionality | All devices | [ ] | (if applicable) |
| MOB-009 | Camera integration | Mobile | [ ] | (if applicable) |
| MOB-010 | GPS/location | Mobile | [ ] | (if applicable) |

---

## 8. Error Handling Testing

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|----------|----------------|--------|-------|
| ERR-001 | Network disconnected | User-friendly error message | [ ] | |
| ERR-002 | Server error (500) | Graceful error handling | [ ] | |
| ERR-003 | Not found (404) | Custom error page/message | [ ] | |
| ERR-004 | Unauthorized (403) | Clear auth error message | [ ] | |
| ERR-005 | Bad request (400) | Validation message shown | [ ] | |
| ERR-006 | Flow failure notification | Admin notified of failure | [ ] | |
| ERR-007 | Retry logic | Automatic retry on transient errors | [ ] | |
| ERR-008 | Data conflict | Conflict resolution message | [ ] | |
| ERR-009 | Timeout handling | Timeout message, no data loss | [ ] | |

---

## 9. Data Validation Testing

| Test ID | Test Case | Input | Expected Result | Status | Notes |
|---------|----------|-------|----------------|--------|-------|
| DATA-001 | Required field empty | Empty | Validation error | [ ] | |
| DATA-002 | Max length exceeded | > max chars | Truncated or error | [ ] | |
| DATA-003 | Invalid date format | "abc" | Date validation error | [ ] | |
| DATA-004 | Invalid email format | "not-an-email" | Email validation error | [ ] | |
| DATA-005 | SQL injection attempt | "'; DROP TABLE" | Sanitized/rejected | [ ] | |
| DATA-006 | XSS attempt | `<script>alert('xss')</script>` | Sanitized/rejected | [ ] | |
| DATA-007 | Special characters | Emojis, unicode | Handled correctly | [ ] | |
| DATA-008 | Numeric bounds | Negative, zero, max | Validated correctly | [ ] | |
| DATA-009 | Date range validation | Future date in past field | Range error | [ ] | |
| DATA-010 | Duplicate detection | Existing value | Duplicate warning | [ ] | |

---

## 10. Regression Testing

| Test ID | Test Case | Related Feature | Status | Notes |
|---------|----------|----------------|--------|-------|
| REG-001 | Core workflow still functions | All previous releases | [ ] | |
| REG-002 | Existing integrations work | Integration layer | [ ] | |
| REG-003 | Existing reports accurate | Reporting layer | [ ] | |
| REG-004 | Security roles unchanged | Security model | [ ] | |
| REG-005 | Data integrity maintained | Data layer | [ ] | |
| REG-006 | Previous UAT scenarios pass | All features | [ ] | |
| REG-007 | Mobile apps unaffected | Mobile layer | [ ] | |
| REG-008 | Performance not degraded | Performance baseline | [ ] | |

---

## 11. Sign-Off

### Test Lead Sign-Off

| Item | Detail |
|------|--------|
| Test Lead Name | |
| Test Execution Date | |
| Total Tests Executed | |
| Pass Rate | |
| Critical Defects Open | |
| High Defects Open | |
| **Recommendation** | **Go / No-Go / Go with reservations** |
| Comments | |
| Signature | |
| Date | |

### Business Sign-Off (UAT)

| Item | Detail |
|------|--------|
| Product Owner Name | |
| UAT Execution Date | |
| UAT Scenarios Passed | |
| UAT Scenarios Failed | |
| Business Concerns | |
| **UAT Result** | **Pass / Fail / Conditional Pass** |
| Comments | |
| Signature | |
| Date | |

### Final Approval

| Role | Name | Approval | Date |
|------|------|----------|------|
| QA Lead | | [ ] Approved | |
| Product Owner | | [ ] Approved | |
| Solution Architect | | [ ] Approved | |
| Delivery Lead | | [ ] Approved | |

---

## Defect Log

| Defect ID | Description | Severity | Category | Status | Assigned To | Resolved Date |
|-----------|------------|----------|----------|--------|-------------|--------------|
| DEF-001 | | Critical/High/Med/Low | | Open/Fixed/Closed | | |
| DEF-002 | | | | | | |

---

## Appendix A: Test Environment Details

| Item | Detail |
|------|--------|
| Environment URL | |
| Environment Version | |
| Browser(s) Tested | |
| Date Range | |
| Test Data Used | |

## Appendix B: Test Data Setup

| Data Type | Records | Setup Method |
|-----------|---------|-------------|
| | | |
