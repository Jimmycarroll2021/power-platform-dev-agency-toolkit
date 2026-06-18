# Copilot Studio Service Desk Agent

## Project Overview

The **Copilot Studio Service Desk Agent** is an intelligent, conversational AI agent built with Microsoft Copilot Studio that serves as the first point of contact for internal IT and HR support requests. It integrates with SharePoint knowledge bases, Dataverse case management, and Power Automate to deliver instant answers, automated troubleshooting, and seamless human handoff — all within Microsoft Teams and the internal web portal.

## Business Problem

Contoso Ltd.'s internal service desk is overwhelmed with repetitive inquiries:

- **4,200 tickets per month** across IT and HR, with 68% classified as "level 1" (self-serviceable)
- **Average first-response time: 6 hours** during business hours, 24+ hours during weekends
- **Employee satisfaction with IT support: 42%** — primarily due to wait times and repetitive questioning
- **Service desk analysts spend 60% of their time** answering the same 25 questions
- **Knowledge articles exist** but employees can't find them (scattered across SharePoint sites, wikis, and email threads)
- **After-hours support is email-only** with next-business-day response
- **25% of tickets are incorrectly routed** requiring reassignment and additional delays

**Top 25 Repeated Inquiries:**
1. Password reset requests (18% of all tickets)
2. VPN connection issues (12%)
3. Software installation requests (10%)
4. Email/calendar sync problems (8%)
5. Printer setup and troubleshooting (7%)
6. Leave balance inquiries (7%)
7. Expense reimbursement status (6%)
8. Benefits enrollment questions (5%)
9. Access request status (5%)
10. Meeting room booking issues (4%)
11. Laptop ordering and provisioning status (4%)
12. MFA setup and issues (3%)
13. Wi-Fi connectivity problems (3%)
14. Teams audio/video issues (3%)
15. HR policy questions (2%)
16. Payroll inquiries (2%)
17. Org chart and reporting structure questions (1%)
18. Training enrollment (1%)
19. Travel booking help (1%)
20. Mobile device setup (1%)
21-25. Various other repetitive questions (5%)

## Solution Summary

This solution deploys an AI-powered conversational agent that:

1. **Answers FAQ Instantly** — Uses generative AI over SharePoint knowledge bases to answer the top 25 repeated questions without human intervention
2. **Automates Common Tasks** — Integrates with Power Automate to perform actions: password resets, software requests, access requests, leave balance lookups
3. **Troubleshoots Interactively** — Guides employees through step-by-step troubleshooting for VPN, printer, Wi-Fi, Teams issues
4. **Creates Tickets When Needed** — For complex issues, collects all required information and creates a properly categorized Dataverse case with full context
5. **Hands Off to Humans Seamlessly** — When escalation is needed, transfers the full conversation history and collected data to a live service desk analyst
6. **Learns Continuously** — Uses conversation analytics to identify knowledge gaps and improve responses over time
7. **Available 24/7** — Employees get instant support at any time, not just during business hours

## Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Service Desk Agent | Copilot Studio | Conversational AI agent with NLU, topics, and generative AI |
| Knowledge Sources | SharePoint Online + Copilot Studio Generative Answers | 150+ knowledge articles for FAQ responses |
| IT Knowledge Base | SharePoint Site | IT policies, troubleshooting guides, how-to articles |
| HR Knowledge Base | SharePoint Site | HR policies, benefits guides, procedure documents |
| Case Management | Dataverse | Ticket creation, tracking, and routing |
| Automation Actions | Power Automate | Password reset, software requests, access requests, lookups |
| Human Handoff | Copilot Studio Live Chat + Dynamics 365 Customer Service | Transfer to live agents with full context |
| Analytics | Copilot Studio Analytics + Power BI | Conversation metrics, deflection rates, satisfaction |
| Teams Channel | Microsoft Teams | Agent deployment channel for organization-wide access |
| Web Portal | Internal SharePoint | Embedded agent for intranet access |

## Architecture Highlights

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EMPLOYEE CHANNELS                                │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Microsoft Teams │  │  Internal Web    │  │  Copilot (Microsoft  │  │
│  │  (Primary)       │  │  Portal          │  │  365)                │  │
│  │                  │  │                  │  │                      │  │
│  │ • Personal chat  │  │ • SharePoint     │  │ • M365 Chat        │  │
│  │ • Team channel   │  │   embedded       │  │   integration      │  │
│  │ • @mention       │  │ • Agent web      │  │ • Side panel       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼─────────────────────┼───────────────────────┼──────────────┘
            │                     │                       │
            └─────────────────────┼───────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      COPILOT STUDIO AGENT                                │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    CONVERSATION LAYER                            │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │    │
│  │  │   Natural    │  │   Generative │  │   Topic Router       │ │    │
│  │  │   Language   │  │   Answers    │  │   (Intent Matching)  │ │    │
│  │  │   Understanding│  │   (RAG over  │  │                      │ │    │
│  │  │              │  │   SharePoint)│  │ • Greeting           │ │    │
│  │  │ • Intent     │  │              │  │ • FAQ                │ │    │
│  │  │   detection  │  │ • 150+ KB    │  │ • Troubleshooting    │ │    │
│  │  │ • Entity     │  │   articles   │  │ • Automation         │ │    │
│  │  │   extraction │  │ • Fallback   │  │ • Case Creation      │ │    │
│  │  │ • Sentiment  │  │   responses  │  │ • Human Handoff      │ │    │
│  │  │   analysis   │  │ • Citations  │  │ • Feedback           │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      TOPIC DEFINITIONS                           │    │
│  │                                                                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │ Password │ │ Software │ │   VPN    │ │  Leave   │          │    │
│  │  │ Reset    │ │ Request  │ │ Troublesh│ │ Balance  │  + 15    │    │
│  │  │ Topic    │ │ Topic    │ │ Topic    │ │ Topic    │  more    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │    │
│  │                                                                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │  Access  │ │  Printer │ │  Email   │ │  Case    │          │    │
│  │  │ Request  │ │  Setup   │ │  Issues  │ │ Creation │          │    │
│  │  │ Topic    │ │  Topic   │ │  Topic   │ │  Topic   │          │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         TOOLS / ACTIONS                          │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │    │
│  │  │   Power      │  │   Dataverse  │  │   Microsoft Graph    │ │    │
│  │  │   Automate   │  │   Connector  │  │   Connector          │ │    │
│  │  │   Flows      │  │              │  │                      │ │    │
│  │  │              │  │ • Create case│  │ • User lookup        │ │    │
│  │  │ • Password   │  │ • Case status│  │ • Manager lookup     │ │    │
│  │  │   reset      │  │ • Update case│  │ • Org chart          │ │    │
│  │  │ • Software   │  │ • KB search  │  │ • OOF status         │ │    │
│  │  │   request    │  │              │  │ • Groups             │ │    │
│  │  │ • Access     │  └──────────────┘  └──────────────────────┘ │    │
│  │  │   request    │                                           │    │
│  │  │ • Leave bal  │                                           │    │
│  │  │   lookup     │                                           │    │
│  │  └──────────────┘                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       BACKEND INTEGRATION LAYER                          │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │   SharePoint │  │   Dataverse  │  │   Power Automate             │  │
│  │   Knowledge  │  │   Case Mgmt  │  │   (Action Flows)             │  │
│  │   Bases      │  │              │  │                              │  │
│  │              │  │ • svc_case   │  │ • svc_Flow_PasswordReset     │  │
│  │ • IT KB Site │  │ • svc_kb_hit │  │ • svc_Flow_SoftwareRequest   │  │
│  │ • HR KB Site │  │ • svc_escal  │  │ • svc_Flow_AccessRequest     │  │
│  │ • 150+ docs  │  │ • svc_satisf │  │ • svc_Flow_LeaveBalance      │  │
│  │              │  │ • svc_metrics│  │ • svc_Flow_PrinterTroubleshoot│  │
│  └──────────────┘  └──────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       HUMAN HANDOFF & ANALYTICS                          │
│                                                                          │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Dynamics 365 CS     │  │  Copilot Studio  │  │   Power BI       │  │
│  │  Live Chat           │  │  Analytics       │  │   Dashboard      │  │
│  │                      │  │                  │  │                  │  │
│  │ • Live agent queue   │  │ • Deflection rate│  │ • Volume trends  │  │
│  │ • Conversation xfer  │  │ • Topic breakdown│  │ • CSAT scores    │  │
│  │ • Context handoff    │  │ • Abandonment    │  │ • Agent workload │  │
│  │ • Agent dashboard    │  │ • Resolution time│  │ • KB gap analysis│  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Benefits

| Metric | Before | After (Projected) |
|--------|--------|-------------------|
| Average first-response time | 6 hours | < 30 seconds |
| Tickets requiring human agent | 100% | ~30% (70% deflected) |
| Employee satisfaction with support | 42% | 80%+ |
| Knowledge article findability | <10% | 85%+ via generative answers |
| After-hours support coverage | Email only (next day) | 24/7 instant responses |
| Ticket routing accuracy | 75% | 95%+ |
| Service desk analyst time on L1 | 60% | 20% (shifted to L2/L3) |
| Cost per support interaction | $18 | $4 |

## Licensing Requirements

> **WARNING:** This solution requires specific Copilot Studio licensing:
>
> - **Copilot Studio** (per tenant, message-based pricing) — required for the agent
> - **Power Automate Premium** — for action flows (password reset, etc.)
> - **Dataverse** — for case management tables
> - **SharePoint Online** — for knowledge bases (typically included with M365)
> - **Dynamics 365 Customer Service** (optional) — for live chat handoff
> - **Microsoft Teams** — for channel deployment
>
> Estimated Copilot Studio consumption: 15,000-25,000 messages/month for 2,000 employees.
>
> Review [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-subscriptions) for current pricing.

## Estimated Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| Discovery & Knowledge Audit | 1 week | Audit knowledge bases, identify top questions, map topics |
| Knowledge Base Preparation | 2 weeks | Curate and optimize 150+ articles for generative AI |
| Agent Development | 3 weeks | Build topics, configure generative answers, create tools/actions |
| Integration Development | 2 weeks | Power Automate flows, Dataverse tables, Graph API |
| Human Handoff Setup | 1 week | Configure live chat, agent workspace, escalation rules |
| Testing & Refinement | 2 weeks | Conversation testing, accuracy tuning, edge case handling |
| Pilot Deployment | 2 weeks | Soft launch to 200 users, gather feedback, iterate |
| Full Rollout | 1 week | Organization-wide launch, training, communications |
| **Total** | **14 weeks** | |

## Success Metrics (KPIs)

| KPI | Target | Measurement |
|-----|--------|-------------|
| Deflection Rate | 70%+ | % of conversations resolved without human handoff |
| CSAT Score | 4.2/5 | Post-conversation satisfaction survey |
| First-Response Time | < 30 seconds | Time from employee message to agent response |
| Topic Coverage | 90%+ | % of top 50 questions answered correctly |
| Abandonment Rate | < 10% | % of conversations where user leaves without resolution |
| Average Conversation Length | 6-8 messages | Efficiency indicator (too short = confused, too long = inefficient) |
| Human Handoff Rate | < 30% | % escalated to live agents |
| Knowledge Gap Identification | 5/month | New KB articles created from unanswered questions |

## Folder Structure

```
copilot-studio-service-agent/
├── README.md           # This file
├── architecture.md     # Detailed agent architecture
├── prd.md              # Product Requirements Document
├── prompts.md          # AI agent prompts for building this solution
└── risks.md            # Risk register and mitigation strategies
```
