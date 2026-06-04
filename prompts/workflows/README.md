# Workflows — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

The `/workflows` directory contains **multi-agent workflow prompts** — structured processes that coordinate multiple agents toward a single outcome. Use these when a task requires sequential or parallel work across more than one agent domain.

---

## Available Workflows

| Workflow | File | Agents Involved | Use When |
|----------|------|----------------|---------|
| Feature Launch | `feature-launch.md` | Product + Technical + Design + SEO + Growth | Launching a new platform feature |
| Content Pipeline | `content-pipeline.md` | SEO + Content + Growth | Creating and publishing a new piece of content |
| Marketplace Product | `marketplace-product.md` | Marketplace + Technical + Design | Adding a new product to the marketplace |
| Sprint Planning | `sprint-planning.md` | SuperAgent CEO + All | Planning a new development sprint |
| Security Audit | `security-audit.md` | Technical + Governance | Monthly security review |

---

## How to Use a Workflow

1. Identify the workflow that matches your task
2. Load the MIT OS Master Prompt (`/prompts/system/mit-os-master-prompt.md`) first
3. Load the workflow prompt
4. Follow the workflow steps — each step specifies which agent handles it
5. Complete the handoff at the end

---

## The Standard Workflow Pattern

Every workflow follows this structure:
```
1. INITIATE — SuperAgent CEO receives task, confirms scope, identifies agents
2. PLAN — Product Agent (if feature) or SEO Agent (if content) creates brief
3. BUILD — Technical Agent and/or Content Agent executes
4. REVIEW — Design Agent and/or Product Agent reviews
5. PUBLISH/DEPLOY — Human (founder) approves and ships
6. DOCUMENT — All agents update documentation
7. HANDOFF — Handoff notes written
```
