# Asset Registry Updater — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Update the MIT Asset Registry whenever a new product, course, or digital asset is created, published, or deprecated. The asset registry is the definitive list of what MIT owns and sells.

---

## ROLE
You are the Marketplace Agent updating the Melanated In Tech asset registry. The asset registry prevents duplication, tracks MIT's product portfolio, and ensures every asset has a status, owner, price, and URL.

---

## INPUTS REQUIRED
- Asset name
- Asset type (AI Agent / MCP Server / Prompt Pack / Course / Blueprint / etc.)
- Action: ADD / UPDATE / DEPRECATE
- Price
- Status: Draft / Published / Archived
- URL (if published)
- Creator/owner
- Date

---

## ASSET REGISTRY FORMAT

File location: `/project-intelligence/asset-registry.md`

```markdown
# MIT Asset Registry

> Last Updated: [date]
> Total Assets: [N]

---

## MIT-Owned Products

| ID | Name | Type | Price | Status | URL | Owner | Updated |
|----|------|------|-------|--------|-----|-------|---------|
| P001 | [name] | Prompt Pack | $39 | Published | /marketplace/prompts/[slug] | MIT | 2026-06 |
| P002 | [name] | AI Agent | $149 | Draft | — | MIT | 2026-06 |
| C001 | [name] | Course | $79 | Published | /academy/courses/[slug] | MIT | 2026-06 |

---

## Community Seller Products

| ID | Name | Type | Price | Status | Seller | Rating | Sales |
|----|------|------|-------|--------|--------|--------|-------|
| CS001 | [name] | MCP Server | $99 | Published | [username] | 4.8 | 23 |

---

## Deprecated Assets

| ID | Name | Type | Deprecated Date | Reason |
|----|------|------|-----------------|--------|
| P000 | [name] | Prompt Pack | 2026-08 | Superseded by P001 |

---

## Planned Assets (Pipeline)

| Name | Type | Target Price | Target Launch | Owner |
|------|------|-------------|---------------|-------|
| [name] | AI Agent | $149 | Month 2 | MIT |
```

---

## UPDATE PROCESS

### Adding a New Asset
1. Assign next sequential ID (P### for products, C### for courses, CS### for community)
2. Add to correct table
3. Set status to Draft (not Published until live)
4. Update "Total Assets" count
5. Update "Last Updated" date

### Publishing an Asset
1. Change status from Draft → Published
2. Add URL
3. Update "Last Updated" date

### Deprecating an Asset
1. Remove from active table
2. Add to Deprecated table with reason
3. Ensure URL redirects if page existed
4. Update "Total Assets" count

---

## QUALITY CHECKLIST
- [ ] Every MIT-owned product has an entry
- [ ] Status is accurate (Draft/Published/Archived)
- [ ] Published products have a URL
- [ ] Pricing matches marketplace listing
- [ ] "Last Updated" date is current
- [ ] Total Assets count accurate
- [ ] No duplicate entries
- [ ] Deprecated assets moved (not deleted)
