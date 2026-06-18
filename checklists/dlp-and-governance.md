---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
  - https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-combined-effect-multiple-policies
  - https://learn.microsoft.com/en-us/power-platform/guidance/adoption/secure-default-environment
  - https://learn.microsoft.com/en-us/power-platform/admin/control-user-access
  - https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit-explained
  - https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing
  - https://learn.microsoft.com/en-us/power-platform/alm/move-from-unmanaged-managed-alm
  - https://learn.microsoft.com/en-us/power-platform/alm/basics-alm
---

# DLP and Governance Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Tenant:** _________________________________

> **Platform-state note (verified 2026-06-19, 2026-H1):** Power Platform data loss prevention is delivered through **data policies** in the Power Platform admin center. Each data policy sorts every connector into one of exactly three groups — **Business**, **Non-business**, and **Blocked** — and an app or flow may use connectors from only one of the Business/Non-business groups at a time. See [Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification) and [Manage data policies](https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss).

---

## 1. DLP Policies

> Section reference: connectors are categorized into the **Business**, **Non-business**, and **Blocked** data groups; new connectors land in **Non-business** by default; restrictions are enforced at both design time and runtime. ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) When several policies apply, **Blocked always wins** and the most restrictive grouping is imposed. ([Combined effect of multiple data policies](https://learn.microsoft.com/en-us/power-platform/admin/dlp-combined-effect-multiple-policies))

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | DLP / data-policy strategy defined ([guidance](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/dlp-strategy)) | [ ] | |
| 1.2 | Default tenant data policy configured ([Manage data policies](https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss)) | [ ] | A tenant-level policy applies to all environments not covered by an environment-scoped policy |
| 1.3 | Environment-specific (environment-scoped) data policies configured ([Manage data policies](https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss)) | [ ] | |
| 1.4 | Production has strictest DLP policy | [ ] | |
| 1.5 | Business connector group defined ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) | [ ] | Connectors hosting business-use data |
| 1.6 | Non-business connector group defined ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) | [ ] | Default landing group for any newly added connector |
| 1.7 | Blocked connectors list reviewed and approved ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) | [ ] | Microsoft-owned **standard** connectors and the **Dataverse** connector can't be blocked; all premium and third-party connectors can |
| 1.8 | HTTP / custom-connector URL patterns policy defined ([Custom connector URL patterns](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) | [ ] | Classify generic connectors (HTTP, HTTP with Microsoft Entra ID, custom connectors) deliberately |
| 1.9 | Custom connectors classified in DLP ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)) | [ ] | Unclassified custom connectors fall into the default (Non-business) group |
| 1.10 | All environments have a DLP policy applied | [ ] | |
| 1.11 | No environment is without a DLP policy | [ ] | A tenant default policy is the safety net for uncovered environments |
| 1.12 | DLP policies tested with sample flows | [ ] | Flows in violation are set to **Suspended** and won't run until the maker resolves the violation ([Impact of data policies](https://learn.microsoft.com/en-us/power-platform/admin/dlp-impact-policies-apps-flows)) |
| 1.13 | DLP policy change approval process defined | [ ] | |
| 1.14 | DLP policy exceptions documented and time-bound | [ ] | |

---

## 2. Environment Strategy

> Section reference: associate an environment with a **security group** to restrict which users can access it; environments with a Dataverse database add **all** org users unless a security group is set as the access filter. The **default environment** cannot be locked down with a security group the same way — the recommended pattern is to route makers to dedicated developer environments and apply layered controls. ([Control user access](https://learn.microsoft.com/en-us/power-platform/admin/control-user-access), [Secure the default environment](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/secure-default-environment))

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | Environment strategy documented ([tenant environment strategy](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy)) | [ ] | |
| 2.2 | Dev/Test/Prod environments provisioned | [ ] | |
| 2.3 | Naming convention followed | [ ] | |
| 2.4 | Environment purpose documented | [ ] | |
| 2.5 | Environment owners assigned | [ ] | |
| 2.6 | Unused environments identified and cleaned up | [ ] | |
| 2.7 | Default environment governed (DLP, sharing limits, routing) ([Secure the default environment](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/secure-default-environment)) | [ ] | Every tenant user gets the Environment Maker role here; can't be removed via a security group, so route makers away and apply a restrictive (Blocked-default) data policy |
| 2.8 | Security groups assigned to environments ([Control user access](https://learn.microsoft.com/en-us/power-platform/admin/control-user-access)) | [ ] | Acts as the access filter for environments with a Dataverse database; does **not** lock down the default environment |
| 2.9 | Maker access controlled | [ ] | Consider default-environment routing scoped by a security group ([Environment groups](https://learn.microsoft.com/en-us/power-platform/admin/environment-groups)) |
| 2.10 | Trial environments monitored and cleaned up | [ ] | |
| 2.11 | Environment creation requires approval ([Control environment creation](https://learn.microsoft.com/en-us/power-platform/admin/control-environment-creation)) | [ ] | Restrict who can create environments (incl. developer-type) to admin roles |
| 2.12 | Environment inventory maintained | [ ] | |

---

## 3. CoE (Center of Excellence)

> **Status note (verified 2026-06-19):** The **CoE Starter Kit is no longer actively maintained** — its core capabilities have moved into the Power Platform admin center, and Microsoft recommends the admin center as the central experience for governance, monitoring, and insights. The kit remains available for existing and new deployments but will not gain new capabilities, and issues are no longer reviewed (security vulnerabilities go to MSRC). Prefer native admin-center governance where it covers your need; use the Starter Kit to fill gaps. ([CoE Starter Kit overview](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit)) The kit ships in **Core**, **Governance**, and **Nurture** module solutions; Core is the foundational dependency for the others. ([CoE Starter Kit modules](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit-explained))

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Governance tooling chosen: native Power Platform admin center vs. CoE Starter Kit (kit no longer actively maintained) ([overview](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit)) | [ ] | Default to admin-center capabilities; install Starter Kit only to fill gaps |
| 3.2 | Core components configured (if Starter Kit used) ([modules](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit-explained)) | [ ] | Inventory sync + admin apps (DLP Editor, Set App Permissions); Core is required by Governance and Nurture |
| 3.3 | Governance components active (if Starter Kit used) ([governance components](https://learn.microsoft.com/en-us/power-platform/guidance/coe/governance-components)) | [ ] | Audit/compliance apps e.g. Developer Compliance Center |
| 3.4 | Nurture components active (if Starter Kit used) ([nurture components](https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup-nurture-components)) | [ ] | Community/onboarding assets; depends on Core |
| 3.5 | Inventory sync running regularly | [ ] | Admin center provides native inventory; Starter Kit sync flows are an alternative |
| 3.6 | Dashboards accessible to stakeholders | [ ] | |
| 3.7 | App catalog maintained | [ ] | |
| 3.8 | Maker onboarding process defined | [ ] | |
| 3.9 | Compliance automation rules configured | [ ] | |
| 3.10 | Environment management automated | [ ] | |
| 3.11 | Orphaned object cleanup automated | [ ] | |
| 3.12 | If Starter Kit is deployed, it is on a supported version (note: kit is no longer enhanced) ([overview](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit)) | [ ] | Plan migration of governance to the admin center over time |

---

## 4. Compliance

> Section reference: **Dataverse auditing** is turned on at the **environment** level in the Power Platform admin center (Security > Compliance > Auditing), then per **table** and per **column**; audit logs are stored in Dataverse and **consume log storage capacity**. Activity (Read) logging requires the minimum Microsoft Office licensing and surfaces in Microsoft Purview. ([Manage Dataverse auditing](https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing), [activity logging in Purview](https://learn.microsoft.com/en-us/power-platform/admin/enable-use-comprehensive-auditing))

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Data governance policy defined | [ ] | |
| 4.2 | Data classification scheme implemented | [ ] | |
| 4.3 | PII handling policy defined | [ ] | |
| 4.4 | Data retention policy defined and enforced | [ ] | Set Dataverse audit retention to meet policy; "Forever" never deletes ([Manage Dataverse auditing](https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing)) |
| 4.5 | Data residency requirements met | [ ] | |
| 4.6 | Dataverse auditing enabled at environment level for business data ([Manage Dataverse auditing](https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing)) | [ ] | Then enable per table + column; logs consume Dataverse log capacity |
| 4.7 | Audit log review process defined (via Purview / Synapse Link export) ([activity logging](https://learn.microsoft.com/en-us/power-platform/admin/enable-use-comprehensive-auditing)) | [ ] | |
| 4.8 | User access reviews scheduled | [ ] | |
| 4.9 | Regulatory requirements mapped to controls | [ ] | |
| 4.10 | Breach notification procedure defined | [ ] | |
| 4.11 | Privacy impact assessment completed | [ ] | |
| 4.12 | Records of processing maintained | [ ] | |

---

## 5. Maker Governance

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Maker onboarding process documented | [ ] | |
| 5.2 | Maker training required before production access | [ ] | |
| 5.3 | Maker code of conduct defined | [ ] | |
| 5.4 | App/flow naming conventions enforced | [ ] | |
| 5.5 | Sharing guidelines documented; sharing limits configured ([Limit sharing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-sharing-limits)) | [ ] | "Share with Everyone" is disabled by default — keep it disabled |
| 5.6 | Production deployment process defined | [ ] | |
| 5.7 | Support channels for makers defined | [ ] | |
| 5.8 | Maker community established | [ ] | |
| 5.9 | Regular maker meetings scheduled | [ ] | |
| 5.10 | Success stories shared | [ ] | |
| 5.11 | Inactive maker apps/flows identified | [ ] | |
| 5.12 | Orphaned apps/flows have cleanup process | [ ] | |

---

## 6. Solution Management

> Section reference: makers develop in the **unmanaged** layer in a dev environment, then export and import as **managed solutions** to all downstream (test/UAT/prod) environments. Microsoft guidance: except for your development environment, you should only have managed solutions in your environments. ([Move from unmanaged to managed](https://learn.microsoft.com/en-us/power-platform/alm/move-from-unmanaged-managed-alm), [ALM basics](https://learn.microsoft.com/en-us/power-platform/alm/basics-alm))

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Solution segmentation strategy defined ([organize solutions](https://learn.microsoft.com/en-us/power-platform/alm/organize-solutions)) | [ ] | |
| 6.2 | Managed solutions in production ([Move from unmanaged to managed](https://learn.microsoft.com/en-us/power-platform/alm/move-from-unmanaged-managed-alm)) | [ ] | Only the dev environment should hold unmanaged solutions; all others receive managed |
| 6.3 | Solution versioning standard defined | [ ] | Managed solutions should be a build artifact produced by a build server ([ALM basics](https://learn.microsoft.com/en-us/power-platform/alm/basics-alm)) |
| 6.4 | ALM pipeline configured ([Pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)) | [ ] | Native Power Platform Pipelines, or Azure DevOps / GitHub; pipelines block tampering with the exported artifact |
| 6.5 | Source control used for solutions | [ ] | |
| 6.6 | Unmanaged changes in production prohibited ([Move from unmanaged to managed](https://learn.microsoft.com/en-us/power-platform/alm/move-from-unmanaged-managed-alm)) | [ ] | Use managed properties to lock components against modification downstream |
| 6.7 | Solution dependency management defined | [ ] | |
| 6.8 | Patch management process defined | [ ] | |
| 6.9 | Solution health monitored | [ ] | |
| 6.10 | Publisher prefix defined and used | [ ] | |

---

## 7. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Power Platform Admin | | [ ] Approved | |
| Security Lead | | [ ] Approved | |
| Compliance Officer | | [ ] Approved | |
| CoE Lead | | [ ] Approved | |
