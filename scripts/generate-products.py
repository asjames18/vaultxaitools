"""Generate product PDF files for Melanated In Tech marketplace."""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

OUTPUT_DIR = r"E:\vaultxaitools\public\products"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Brand colors
BLACK = colors.HexColor("#000000")
GREEN = colors.HexColor("#22c55e")
WHITE = colors.HexColor("#ffffff")
GRAY = colors.HexColor("#9ca3af")
LIGHT_GRAY = colors.HexColor("#d1d5db")
DARK_GRAY = colors.HexColor("#1f2937")

# ─── STYLES ──────────────────────────────────────────────────────────────────

def make_styles():
    return {
        "cover_title": ParagraphStyle("cover_title", fontSize=36, textColor=WHITE,
            fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=12, leading=44),
        "cover_sub": ParagraphStyle("cover_sub", fontSize=18, textColor=GREEN,
            fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=8, leading=24),
        "cover_brand": ParagraphStyle("cover_brand", fontSize=13, textColor=GRAY,
            fontName="Helvetica", alignment=TA_CENTER, spaceAfter=4),
        "section_head": ParagraphStyle("section_head", fontSize=14, textColor=GREEN,
            fontName="Helvetica-Bold", spaceBefore=18, spaceAfter=6, leading=18),
        "prompt_num": ParagraphStyle("prompt_num", fontSize=10, textColor=GREEN,
            fontName="Helvetica-Bold", spaceBefore=8, spaceAfter=2),
        "prompt_body": ParagraphStyle("prompt_body", fontSize=10, textColor=LIGHT_GRAY,
            fontName="Helvetica", spaceAfter=4, leading=15),
        "body": ParagraphStyle("body", fontSize=10, textColor=LIGHT_GRAY,
            fontName="Helvetica", spaceAfter=6, leading=15),
        "label": ParagraphStyle("label", fontSize=10, textColor=GREEN,
            fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=3),
        "field": ParagraphStyle("field", fontSize=10, textColor=LIGHT_GRAY,
            fontName="Helvetica", spaceAfter=4, leading=15),
        "page_head": ParagraphStyle("page_head", fontSize=16, textColor=WHITE,
            fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=10, leading=20),
        "footer": ParagraphStyle("footer", fontSize=8, textColor=GRAY,
            fontName="Helvetica", alignment=TA_CENTER),
        "checklist": ParagraphStyle("checklist", fontSize=10, textColor=LIGHT_GRAY,
            fontName="Helvetica", spaceAfter=5, leading=15),
    }

def dark_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, letter[0], letter[1], fill=True, stroke=False)
    canvas.restoreState()

def cover_page(title, subtitle, styles):
    story = []
    story.append(Spacer(1, 2.2 * inch))
    story.append(Paragraph(title, styles["cover_title"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(HRFlowable(width="60%", thickness=1, color=GREEN, spaceAfter=16))
    story.append(Paragraph(subtitle, styles["cover_sub"]))
    story.append(Spacer(1, 1.8 * inch))
    story.append(Paragraph("Melanated In Tech", styles["cover_brand"]))
    story.append(Paragraph("melanatedintech.com", styles["cover_brand"]))
    story.append(PageBreak())
    return story

# ─── PDF 1: CONTENT CREATION PROMPT PACK ────────────────────────────────────

def build_prompt_pack():
    path = os.path.join(OUTPUT_DIR, "content-creation-prompt-pack.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch)

    styles = make_styles()
    story = cover_page("Content Creation\nPrompt Pack",
                       "50 Battle-Tested Claude Prompts", styles)

    sections = [
        ("Section 1 — Blog Posts & Articles", [
            ("1", "Write a [word count] blog post about [topic] for [audience]. Use a conversational tone, include 3 actionable tips, and end with a CTA to [goal]."),
            ("2", "Rewrite this blog post intro to hook the reader in the first 2 sentences: [paste intro]"),
            ("3", "Create an outline for a pillar post on [topic] with 5 H2 sections and 3 H3 subsections each."),
            ("4", "Write a conclusion for a blog post about [topic] that summarizes key points and drives readers to [next action]."),
            ("5", "Generate 10 blog post title ideas for [topic] that would perform well for SEO and social sharing."),
            ("6", "Write a 150-word meta description for a blog post titled [title] targeting the keyword [keyword]."),
            ("7", "Transform this listicle into a narrative-style blog post while keeping all the key points: [paste content]"),
            ("8", "Write a 'What I Learned' reflection post about [experience] that teaches [lesson] to [audience]."),
            ("9", "Create a FAQ section with 8 questions and answers for a blog post about [topic]."),
            ("10", "Write a 500-word introduction to a comprehensive guide about [topic] that establishes authority and previews what the reader will learn."),
        ]),
        ("Section 2 — Social Media", [
            ("11", "Write 5 LinkedIn posts about [topic] in different formats: a story, a listicle, a hot take, a question, and a lesson learned."),
            ("12", "Create a Twitter/X thread with 8 tweets about [topic]. Start with a hook tweet and end with a CTA."),
            ("13", "Write 3 Instagram captions for a post about [topic]: one short (under 50 words), one medium (100 words), one long with storytelling (200 words)."),
            ("14", "Generate 15 hashtags for a post about [topic] in the [industry] space. Mix popular and niche."),
            ("15", "Rewrite this post to perform better on [platform]: [paste post]"),
            ("16", "Write a Facebook group post that sparks discussion about [topic] for [community type]."),
            ("17", "Create 5 'hooks' for social posts about [topic] that stop the scroll."),
            ("18", "Write a LinkedIn article intro (200 words) about [topic] that positions me as an expert in [field]."),
            ("19", "Turn this long-form content into 5 short social media posts: [paste content]"),
            ("20", "Write a TikTok/Reels script (60 seconds) teaching [topic] with a strong hook in the first 3 seconds."),
        ]),
        ("Section 3 — Email Marketing", [
            ("21", "Write a welcome email for new subscribers to [newsletter name] about [topic]. Include what they can expect and a quick win."),
            ("22", "Create a 5-email nurture sequence for [product/service] that moves subscribers from awareness to purchase."),
            ("23", "Write a re-engagement email for subscribers who haven't opened in 90 days. Subject line + body."),
            ("24", "Write a product launch email for [product] to my existing audience. Include urgency without being pushy."),
            ("25", "Create a weekly newsletter template with sections for: main insight, tool recommendation, quick tip, and community spotlight."),
            ("26", "Write a cold outreach email to [target person/company] about [opportunity]. Keep it under 150 words."),
            ("27", "Write a follow-up email sequence (3 emails) for people who visited my sales page but didn't buy."),
            ("28", "Create an abandoned cart email for [product] that addresses the top 3 objections buyers have."),
            ("29", "Write a case study email showcasing how [customer] achieved [result] using [product/method]."),
            ("30", "Write a 'controversial opinion' newsletter issue about [topic in your industry] that builds engagement."),
        ]),
        ("Section 4 — Video Scripts & Podcasts", [
            ("31", "Write a YouTube video script (5-7 minutes) about [topic]. Include hook, main content with 3 points, and outro CTA."),
            ("32", "Create a podcast episode outline for a solo episode about [topic] with timestamps."),
            ("33", "Write a YouTube Shorts script (60 seconds) that teaches one specific thing about [topic]."),
            ("34", "Create 10 YouTube title ideas for a video about [topic] optimized for clicks and search."),
            ("35", "Write a video description (300 words) for a YouTube video about [topic] with keywords and chapter timestamps."),
            ("36", "Create a podcast intro script (30 seconds) that hooks listeners and explains what the show is about."),
            ("37", "Write 5 interview questions for a podcast guest who is an expert in [field]."),
            ("38", "Turn this blog post into a video script keeping the same structure: [paste post]"),
            ("39", "Write a sponsored segment script (60 seconds) for [brand] that feels natural and not salesy."),
            ("40", "Create a 'story time' YouTube script about [personal experience] that teaches [lesson]."),
        ]),
        ("Section 5 — AI-Powered Content Strategy", [
            ("41", "Create a 30-day content calendar for [platform] about [topic/niche] with post types and themes for each day."),
            ("42", "Analyze this piece of content and tell me 5 ways to repurpose it across different platforms: [paste content]"),
            ("43", "Write 10 content ideas for [platform] based on the trend: [describe trend]."),
            ("44", "Create a content pillar strategy for [brand/personal brand] with 5 main pillars and 5 content ideas per pillar."),
            ("45", "Write a brand voice guide for [brand name] with tone descriptors, words to use, words to avoid, and 3 examples."),
            ("46", "Generate 20 content ideas for [niche] that have not been overdone and provide genuine value."),
            ("47", "Turn these bullet points into a full piece of content in my brand voice: [describe voice] [paste bullets]"),
            ("48", "Write a content brief for a freelance writer covering [topic] including audience, tone, keywords, and outline."),
            ("49", "Create a 90-day content strategy for growing [platform] from [current followers] to [goal] in [niche]."),
            ("50", "Audit this content piece and score it 1-10 on: clarity, value, engagement potential, SEO, and CTA strength. Then rewrite the weakest section: [paste content]"),
        ]),
    ]

    for section_title, prompts in sections:
        story.append(HRFlowable(width="100%", thickness=1, color=DARK_GRAY, spaceAfter=4))
        story.append(Paragraph(section_title, styles["section_head"]))
        for num, text in prompts:
            story.append(Paragraph(f"Prompt #{num}", styles["prompt_num"]))
            story.append(Paragraph(text, styles["prompt_body"]))
        story.append(PageBreak())

    # Footer page
    story.append(Spacer(1, 4 * inch))
    story.append(HRFlowable(width="100%", thickness=1, color=DARK_GRAY, spaceAfter=12))
    story.append(Paragraph(
        "© 2026 Melanated In Tech · melanatedintech.com · All rights reserved.<br/>"
        "For personal use only. Do not distribute.",
        styles["footer"]))

    doc.build(story, onFirstPage=dark_page, onLaterPages=dark_page)
    print(f"Created: {path}")
    return path


# ─── PDF 2: BRAND KIT TEMPLATE ───────────────────────────────────────────────

def build_brand_kit():
    path = os.path.join(OUTPUT_DIR, "brand-kit-template.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch)

    styles = make_styles()
    story = cover_page("Brand Kit Template",
                       "Your Complete Brand Identity System", styles)

    def section(title):
        story.append(Spacer(1, 0.1*inch))
        story.append(HRFlowable(width="100%", thickness=1, color=DARK_GRAY, spaceAfter=4))
        story.append(Paragraph(title, styles["section_head"]))

    def field(label, hint=""):
        story.append(Paragraph(label, styles["label"]))
        line = f"<u>{'_' * 55}</u>" if not hint else f"{hint}  <u>{'_' * 30}</u>"
        story.append(Paragraph(line, styles["field"]))

    def body(text):
        story.append(Paragraph(text, styles["body"]))

    # PAGE 1 — Brand Foundation
    story.append(Paragraph("Page 1 — Brand Foundation", styles["page_head"]))
    section("YOUR BRAND STORY")
    field("Brand Name:")
    field("Tagline:")
    field("Founded:")
    field("Mission Statement (why you exist):")
    story.append(Paragraph("<u>" + "_" * 55 + "</u>", styles["field"]))
    field("Vision Statement (where you're going):")
    story.append(Paragraph("<u>" + "_" * 55 + "</u>", styles["field"]))
    field("Brand Promise (what customers can always expect):")
    story.append(Paragraph("<u>" + "_" * 55 + "</u>", styles["field"]))

    section("YOUR BRAND PERSONALITY")
    body("Choose 3–5 that describe your brand:")
    body("Bold · Nurturing · Innovative · Trustworthy · Playful · Sophisticated · Rebellious · "
         "Empowering · Minimalist · Vibrant · Professional · Raw &amp; Authentic · Luxurious · "
         "Approachable · Expert")
    field("Your chosen traits:")
    field("What your brand is NOT:")
    story.append(PageBreak())

    # PAGE 2 — Visual Identity
    story.append(Paragraph("Page 2 — Visual Identity", styles["page_head"]))
    section("COLOR PALETTE")
    for label in ["Primary Color", "Secondary Color", "Neutral Light", "Neutral Dark", "Accent Color"]:
        story.append(Paragraph(
            f"<b><font color='#22c55e'>{label}:</font></b>  Name: <u>{'_'*14}</u>  "
            f"Hex: #<u>{'_'*6}</u>  Usage: <u>{'_'*20}</u>",
            styles["field"]))

    section("TYPOGRAPHY")
    for label in ["Heading Font", "Subheading Font", "Body Font", "Accent Font"]:
        story.append(Paragraph(
            f"<b><font color='#22c55e'>{label}:</font></b>  <u>{'_'*20}</u>  "
            f"Size: <u>{'_'*4}</u>  Weight: <u>{'_'*8}</u>",
            styles["field"]))
    body("Free font recommendations: Inter · Plus Jakarta Sans · DM Sans · Sora · Outfit")

    section("LOGO USAGE")
    for rule in [
        "Primary logo: full color on light background",
        "Reversed logo: white on dark background",
        "Icon only: for favicon, profile photos, small spaces",
        "Minimum size: never smaller than 32px",
        "Clear space: always maintain padding equal to the height of the logo mark",
    ]:
        body(f"• {rule}")
    story.append(PageBreak())

    # PAGE 3 — Brand Voice
    story.append(Paragraph("Page 3 — Brand Voice", styles["page_head"]))
    section("TONE OF VOICE")
    field("How you sound:")
    field("How you don't sound:")

    section("WRITING STYLE RULES")
    for rule in [
        "Sentence length: (short / medium / long)",
        "Use of slang / colloquialisms: (yes / no / sometimes)",
        "Use of humor: (yes / no / sometimes)",
        "POV: (first person / second person / third person)",
        "Oxford comma: (yes / no)",
        "Exclamation points: (use freely / use sparingly / avoid)",
    ]:
        story.append(Paragraph(
            f"• {rule}  <u>{'_'*15}</u>", styles["field"]))

    section("POWER WORDS")
    body("List 10 words your brand loves to use:")
    story.append(Paragraph(
        "  ".join([f"{i}.<u>{'_'*10}</u>" for i in range(1, 11)]),
        styles["field"]))
    field("Words your brand NEVER uses:")

    section("EXAMPLE COPY")
    field("On-brand headline example:")
    field("Off-brand headline example:")
    field("On-brand social post example:")
    field("Off-brand social post example:")
    story.append(PageBreak())

    # PAGE 4 — Social Media
    story.append(Paragraph("Page 4 — Social Media & Templates", styles["page_head"]))
    section("PROFILE CONSISTENCY")
    field("Profile photo style:")
    body("Bio template: [Role] helping [audience] [achieve outcome] | [proof point] | [CTA + link]")
    field("Your bio:")
    story.append(Paragraph("<u>" + "_" * 55 + "</u>", styles["field"]))

    section("CONTENT PILLARS (pick 4–5)")
    for i in range(1, 6):
        story.append(Paragraph(
            f"<b><font color='#22c55e'>Pillar {i}:</font></b>  <u>{'_'*25}</u>  "
            f"% of content: <u>{'_'*5}</u>",
            styles["field"]))

    section("POST TEMPLATES")
    templates = [
        ("Educational", "Most people don't know that [insight]. Here's what [audience] should know: [3 points]. Save this for later."),
        ("Story", "I used to [struggle]. Then I [turning point]. Now I [result]. Here's what changed: [lesson]."),
        ("Engagement", "Unpopular opinion: [hot take]. Agree or disagree? Drop your thoughts below."),
        ("Promotional", "[Problem]? [Your product] helps you [solution]. [Proof]. [CTA]."),
    ]
    for label, tmpl in templates:
        story.append(Paragraph(f"<b><font color='#22c55e'>{label}:</font></b>", styles["label"]))
        body(f'"{tmpl}"')
    story.append(PageBreak())

    # PAGE 5 — Checklist
    story.append(Paragraph("Page 5 — Brand Checklist & Launch", styles["page_head"]))
    section("BEFORE YOU LAUNCH CHECKLIST")
    checklist_items = [
        "Logo files saved in PNG, SVG, and PDF formats",
        "Color hex codes documented and saved",
        "Fonts downloaded and installed",
        "Brand voice guide shared with anyone creating content",
        "Social media profiles updated with consistent bio, photo, and links",
        "Website reflects brand colors and fonts",
        "Email signature updated",
        "Business cards updated (if applicable)",
        "Canva Brand Kit created with colors and fonts",
        "Brand guideline doc shared with team/contractors",
    ]
    for item in checklist_items:
        story.append(Paragraph(f"☐  {item}", styles["checklist"]))

    section("BRAND AUDIT (do this every 6 months)")
    audit_items = [
        "Does all content look and sound consistent?",
        "Have your audience or goals evolved? Update brand accordingly.",
        "Are your colors and fonts rendering correctly across devices?",
        "Does your brand still feel aligned with your values?",
    ]
    for item in audit_items:
        story.append(Paragraph(f"☐  {item}", styles["checklist"]))

    story.append(Spacer(1, 0.5 * inch))
    story.append(HRFlowable(width="100%", thickness=1, color=DARK_GRAY, spaceAfter=12))
    story.append(Paragraph(
        "© 2026 Melanated In Tech · melanatedintech.com · All rights reserved.<br/>"
        "Template for personal and commercial use.",
        styles["footer"]))

    doc.build(story, onFirstPage=dark_page, onLaterPages=dark_page)
    print(f"Created: {path}")
    return path


if __name__ == "__main__":
    p1 = build_prompt_pack()
    p2 = build_brand_kit()
    print("\nBoth PDFs generated successfully.")
    print(f"  {p1}")
    print(f"  {p2}")
