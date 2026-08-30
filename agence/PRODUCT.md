# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: international visitors to Algeria who want to plan and book a complete trip (flights, circuits, hotels, car rental, payments) with local support. Local Algerian travelers are also served by the same offers, but the primary job-to-be-done is the out-of-region visitor needing a turnkey trip.

## Product Purpose

El Bayadh Travels is a local travel agency based in the wilaya of El Bayadh, Algeria. The site lets a visitor discover destinations and circuits, build a booking, pay online, and access practical travel tools (weather, currency conversion, map) from one place. Success means a visitor can move from discovery to a paid, confirmed trip without leaving the site or needing a call.

## Positioning

Full-service convenience: flights, circuits, hotels, car rental, reservations, payments, currency and weather tools all in one site — in contrast to big online travel sites, backed by a local team that knows the region. The differentiator is the combination of complete self-service breadth and local presence.

## Operating Context

- The site is used online by international visitors, most of whom will not have visited El Bayadh before; they evaluate both the destination and the agency's trustworthiness from the site.
- Multilingual by design: French is the source language; English and Arabic are fully translated, with right-to-left layout for Arabic.
- Front end runs the deployed "Maghreb Saharien" theme (copper `#c97b3a` / green `#234d42` / sand palette in `--ka-*`/`--eb-*` tokens), with a persistent dark/light toggle (`data-theme` + `localStorage.theme`).
- Payments run through Stripe (public/secret/webhook keys via environment variables with empty fallbacks, so the app runs without them).
- Weather data comes from OpenWeatherMap (current conditions) and Open-Meteo (7-day forecast); currency conversion from the Fixer API.
- Deployed to PythonAnywhere (`ingfou32.pythonanywhere.com` in ALLOWED_HOSTS); source lives at `https://github.com/ingfou-cpu/agence_api.git`.

## Capabilities and Constraints

Confirmed functionality:
- Destinations and tourist circuits with detail pages and booking flows; hotel and cruise reservations; car rental.
- Payment records and history (Stripe); booking recap and confirmation pages.
- Testimonials (read and submit), contact form, newsletter signup, blog.
- Search across offers; interactive map with a marker per Destination and pack_travel (coordinates default to 33.7, 3.0 unless set in admin).
- Currency converter and a live-weather section (current + 7-day forecast with recent searches).
- Multilingual FR/EN/AR via Django i18n; Arabic renders RTL.

Technical constraints:
- Django 6 / Python 3.14; two apps: `Agapp` (travel site) and `weatherapp`.
- SQLite database (`db.sqlite3`, gitignored); schema changes travel only via migrations.
- `media/` and `static/` are tracked in git; only `*.pyc`, `__pycache__/`, `.env`, `db.sqlite3` are ignored.
- Environment keys (Stripe, Fixer) come from `agence/.env`; the OpenWeatherMap API key is hardcoded in `weatherapp/views.py`.
- Sanity check command: `manage.py check`; no test suite exists (tests are empty stubs).
- 7-day weather forecast is cached per session with a 1-hour TTL and must stay language-neutral (translated only at render time).

## Brand Commitments

- Name: "El Bayadh Travels" — rendered in Latin letters across templates (hero, footer, title), not translated into French/English/Arabic.
- A local tourism agency of the El Bayadh wilaya, Algeria; identity centers on this local origin.
- Copy currently in French as the source; tone is informative and service-oriented.

## Evidence on Hand

- Agency self-description on the About page (local actor in El Bayadh, flight booking, circuits, car rental, hotels).
- Destination and circuit content already present in the database and templates (e.g., Parc de l'Ahaggar, Tassili n'Ajjer, Kairouan, Hammamet).
- Media assets under `media/` (destination images).
- No confirmed press, legal, licensing, or deployment claims beyond PythonAnywhere hosting.

## Product Principles

- Full-service breadth: keep discovery, booking, payment, and travel tools in one coherent journey.
- Local-first credibility: the El Bayadh origin is the trust anchor; preserve it in every language.
- Multilingual by default: FR/EN/AR with correct RTL rendering is a baseline, not an enhancement.
- Transactional reliability: bookings and payments must be transparent and confirmable end-to-end.
- Respect existing integrations and secrets: Stripe/Fixer/weather APIs and environment-key handling stay as they are unless the owner changes them.

## Accessibility & Inclusion

- Arabic is served right-to-left; all three languages must render with correct directionality and translated labels.
- No additional product-specific accessibility standard has been confirmed yet; this section is open to additions.
