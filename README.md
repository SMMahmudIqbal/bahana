# Bahana (বাহানা) — The Bangladeshi Excuse Generator

> **Developed by S. M. Mahmud Iqbal**  
> *Minimalist, Culturally Grounded Excuse Generation Engine for Everyday Scenarios*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bahana--app.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://bahana-app.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-18181b?style=for-the-badge&logo=github)](https://github.com/SMMahmudIqbal/bahana)
[![Author](https://img.shields.io/badge/Developed%20By-S.%20M.%20Mahmud%20Iqbal-6366f1?style=for-the-badge)](https://github.com/SMMahmudIqbal)
[![License](https://img.shields.io/badge/License-MIT-71717a?style=for-the-badge)](LICENSE)

---

## Overview

**Bahana** is a minimalist, culturally nuanced web application designed to generate realistic, context-specific excuses tailored to daily Bangladeshi life. Whether dealing with infamous Dhaka traffic, late assignment submissions, delayed payments, missed calls, or canceled hangouts, Bahana produces instant, credible justifications filtered by situation and recipient.

The application features dual-language rendering (Standard Bangla and Banglish transliteration), high-resolution social story card export, instant messenger sharing, and zero extraneous visual clutter.

---

## Core Features

- **Instant Excuse Generation**: One-touch tactile trigger and keyboard `Spacebar` hotkey support for rapid generation.
- **Context and Situation Filtering**:
  - Class and campus delays
  - Workplace and corporate meeting delays
  - Missed calls and late message responses
  - Social hangout cancellations
  - Assignment and project deadlines
  - Borrowed money repayment deferrals
  - Family invitations and late home returns
- **Target Audience Segmentation**:
  - Friends / Peers
  - Managers / Team Leads
  - Teachers / Professors
  - Romantic Interests / Crushes
  - Parents / Family
  - Colleagues / Coworkers
- **Multi-Channel Sharing**: One-click sharing via Facebook Messenger, WhatsApp, or instant clipboard copy.
- **Social Story Card Exporter**: Generates 1080x1080 high-resolution branded cards optimized for Instagram and Facebook Stories.
- **Panic Safe Mode**: Instant emergency button providing foolproof, low-risk excuses for sudden incoming calls.
- **Local Bookmarking**: Client-side bookmarking system allowing users to save preferred excuses locally.
- **Custom Excuse Engine**: Empowers users to submit custom excuses saved to browser local storage.
- **Minimalist Aesthetic**: Clean typography featuring *Hind Siliguri* and *Inter*, high-contrast dark/light modes, and a strict no-emoji policy.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Generation**: `html-to-image` for canvas-based story card rendering
- **Deployment**: Vercel

---

## Local Development

```bash
# Clone repository
git clone https://github.com/SMMahmudIqbal/bahana.git
cd bahana

# Install dependencies
npm install

# Start local development server
npm run dev

# Create production build
npm run build
```

---

## Deployment

### Vercel CLI
```bash
npx vercel --prod
```

### GitHub Integration
Connect the repository directly to [Vercel](https://vercel.com) with the `Vite` framework preset.

---

## Author and Attribution

**Developed by S. M. Mahmud Iqbal**  
- GitHub: [@SMMahmudIqbal](https://github.com/SMMahmudIqbal)

---

## License

This project is licensed under the MIT License.
