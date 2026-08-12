---
title: What SanctuaryBase taught me about scope
url: sanctuarybase-scope
description: A 60-screen platform sounds impressive until you remember every one of those screens started as a real problem someone was having with a spreadsheet.
author: Shiann Bowman
date: 2026-02-03T09:00:00.000Z
tags:
    - post
    - build
    - ops
---

SanctuaryBase started small. Saint Francis Rescue & Sanctuary of Yuma needed a way to stop losing track of animal medical records across group chats and paper folders. That was it. That was the whole ask.

It ended up being 60 screens: 16-tab animal records, volunteer shift scheduling, a donor CRM, a vet triage hub, grant and finance tracking, all behind role-based access, shipped as an offline-capable PWA.

## How a small ask becomes a real platform

It didn't happen because I decided to build something big. It happened because every feature I shipped exposed the next real problem. Digitizing medical records meant staff could finally see gaps in vaccine schedules — which meant they needed a way to flag it. Flagging it meant someone needed to be notified — which meant role-based permissions. Permissions meant a login system, which meant user management, which meant volunteer scheduling made sense to fold in too, since the same people needed both.

None of that was scope creep in the bad sense. Each piece was the honest next problem, not a nice-to-have I invented.

## The part that actually matters

The reason SanctuaryBase is still in daily use isn't the 60 screens. It's that it works offline, because rescue work happens in barns and back rooms with bad signal, and a tool that only works with perfect wifi is a tool nobody opens twice.

If you're building something for people who actually have to use it under real conditions — a rescue, a caregiving shift, a retail floor — build for the worst version of their day, not the demo.
