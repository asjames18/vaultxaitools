# Church/Media Tools Cleanup Script

## Overview

This script helps clean up the tools database to focus on church/media/ministry-relevant tools. It identifies tools that are relevant to church media production and removes or archives tools that don't fit this focus.

## What It Does

1. **Analyzes all tools** in the database
2. **Identifies relevant tools** based on:
   - Categories (Video Editing, Graphics Design, Social Media, etc.)
   - Keywords related to media production and church/ministry use cases
3. **Identifies irrelevant tools** that should be removed:
   - Tools related to finance, healthcare, legal, real estate, etc.
   - Tools that don't relate to media production or church/ministry
4. **Updates categories** to match church/media categories
5. **Provides a report** before making changes

## Church/Media Categories

The script uses these categories:
- **Video Editing** - Video editing tools for church videos
- **Graphics Design** - Design tools for church graphics and social media
- **Social Media** - Social media management for ministry outreach
- **Live Streaming** - Streaming tools for church services
- **Audio/Podcasting** - Audio tools for sermons and podcasts
- **Content Creation** - AI tools for writing and content (ChatGPT, Claude, etc. are kept here)
- **Website Building** - Website builders for church sites
- **Email Marketing** - Email tools for church communications
- **Project Management** - Planning tools for church events
- **Communication** - Messaging tools for church teams
- **Language** - AI language tools useful for content creation (ChatGPT, Claude, etc.)

## How to Use

1. **Review the script first** (it's set to analyze only by default)
2. **Run the script**:
   ```bash
   node scripts/cleanup-church-media-tools.js
   ```
3. **Review the output** - it will show:
   - How many tools are relevant vs irrelevant
   - Which tools will be removed
   - Which tools need category updates
4. **Uncomment the execution code** in the script if you want to proceed
5. **Run again** to actually make the changes

## Safety Features

- **Analysis mode by default** - Won't make changes unless you uncomment the execution code
- **Shows preview** - Lists all tools that will be affected before making changes
- **Category mapping** - Automatically maps tools to appropriate church/media categories

## Criteria for Keeping Tools

Tools are kept if they:
- ✅ Are in the whitelist (ChatGPT, Claude, and other useful AI tools)
- ✅ Are in a church/media category
- ✅ Have keywords related to media production (video, graphics, social media, etc.)
- ✅ Have keywords related to church/ministry use cases
- ✅ Are AI tools that relate to media/church (like transcription, content creation, etc.)

**Whitelisted Tools** (always kept):
- ChatGPT, Claude, Perplexity, Bard, Gemini (AI language tools for content creation)
- Notion AI, Grammarly, Otter.ai, Descript, Fireflies (productivity/content tools)
- Jasper, Copy.ai (content creation)
- Runway, Synthesia, Lumen5, Pictory (AI video tools)
- Midjourney, DALL-E, Stable Diffusion, Canva AI (AI design tools)

Tools are removed if they:
- ❌ Are in irrelevant categories (Finance, Healthcare, Legal, etc.)
- ❌ Have keywords indicating non-media focus (cryptocurrency, medical, legal, etc.)
- ❌ Don't relate to church/media/ministry use cases

## Notes

- The script is conservative - it keeps tools that might be useful for church/media even if they're not explicitly church-focused
- AI tools are kept if they relate to media production (like AI for video editing, content creation, transcription, etc.)
- Review the output carefully before executing the cleanup

