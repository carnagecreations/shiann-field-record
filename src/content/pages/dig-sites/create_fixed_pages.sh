#!/bin/bash
declare -A sites=(
  [operations]="Operations"
  [caregiving]="Caregiving"
  [training]="Training"
  [webdesign]="Web Design"
  [marketing]="Marketing"
  [crisis]="Crisis"
  [retail]="Retail"
  [cleaning]="Cleaning"
)

for siteId in "${!sites[@]}"; do
  cat > "${siteId}.html" << ENDFILE
---
title: "${sites[$siteId]} | Field Record"
description: "Shiann Bowman's work in ${sites[$siteId]}"
permalink: "/dig-sites/${siteId}/"
siteId: "${siteId}"
---

{% extends "layouts/base.html" %}

{% block head %}
    <link rel="stylesheet" href="/assets/css/dig-site.css">
{% endblock %}

{% block body %}
    {% set siteData = digSites | selectattr('id', 'equalto', '${siteId}') | first %}
    {% include 'layouts/dig-site.html' %}
{% endblock %}
ENDFILE
done
echo "Created all fixed dig-site pages"
