#!/bin/bash
sites=("caregiving" "training" "webdesign" "marketing" "crisis" "retail" "cleaning")
titles=("Healthcare & Caregiving" "Training & Documentation" "Web Design & Builder" "Marketing & Content" "Crisis & Support" "Retail & Customer Service" "Home Cleaning")
descriptions=("Shiann Bowman's work in caregiving, healthcare, and support." "Shiann Bowman's training, documentation, and SOP work." "Shiann Bowman's web design and development work." "Shiann Bowman's marketing, content, and community work." "Shiann Bowman's crisis response and support work." "Shiann Bowman's retail and customer service experience." "Clean Convictions - professional home cleaning services.")

for i in "${!sites[@]}"; do
  cat > "${sites[$i]}.html" << ENDFILE
---
title: "${titles[$i]} | Field Record"
description: "${descriptions[$i]}"
permalink: "/dig-sites/${sites[$i]}/"
layout: "dig-site.html"
siteId: "${sites[$i]}"
---
ENDFILE
done
echo "Created all dig site pages"
