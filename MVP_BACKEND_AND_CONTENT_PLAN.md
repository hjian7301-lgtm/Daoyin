# DaoYin MVP Backend And Content Plan

This document covers the next implementation layer outside the product catalog and payment gateway.

## Scope

Payment is intentionally deferred. Product details, real inventory, photography, and pricing are also deferred until the product library is confirmed.

This MVP layer focuses on:

- Account persistence
- Oracle reading persistence
- Public reading sharing
- Order placeholder workflow
- Kai Guang / 开光 service workflow
- DaoYin ID / 道印编号 management
- Recorded consecration video workflow
- Hexagram and interpretation content management
- Legal, privacy, and cultural disclaimers

## Recommended Stack

The current site already runs on Cloudflare Pages. The simplest aligned stack is:

- Frontend: current static Pages site, later upgraded to a small framework only if needed
- API: Cloudflare Pages Functions or Workers
- Database: Cloudflare D1
- File storage: Cloudflare R2 for recorded consecration videos and future media
- Auth: email code login or hosted auth later; MVP can start with email-based account records
- Deployment: GitHub to Cloudflare Pages, already active

This keeps hosting, domain, API, database, and media storage inside Cloudflare.

## Core Data Model

### users

Stores customer identity and daily oracle limit.

Fields:

- id
- email
- display_name
- locale
- created_at
- last_login_at

### oracle_readings

Stores the actual reading result so public links and account history work across devices.

Fields:

- id
- user_id
- reading_date
- question_type
- question_text
- question_visibility
- birth_date
- birth_time
- birth_country
- birth_city
- birth_pattern_summary
- lines_json
- changed_lines_json
- hexagram_id
- changed_hexagram_id
- slip_grade
- slip_poem
- slip_guidance
- public_share_token
- created_at

Rule:

- One `user_id` can create at most one oracle reading per local calendar day.
- Shopping and order creation are not limited by this rule.

### hexagrams

Stores 64 hexagrams and their core cultural text.

Fields:

- id
- symbol
- name_cn
- full_name_cn
- pinyin
- judgment_cn
- image_cn
- modern_interpretation_en
- modern_interpretation_zh
- theme_tags_json
- recommendation_tags_json
- status

Note:

- Classical Yi Jing source text remains in Chinese as cultural symbol text.
- English interpretation should be original copy, not copied from a translation.

### yao_texts

Stores line-level text and interpretation.

Fields:

- id
- hexagram_id
- line_number
- line_type
- original_cn
- interpretation_en
- interpretation_zh
- risk_note_en
- risk_note_zh

### dao_yin_ids

Numbering library for unique item identity.

Fields:

- id
- code
- product_sku
- product_category
- status
- order_id
- order_item_id
- assigned_at
- notes

Statuses:

- available
- reserved
- sold
- kai_guang_pending
- kai_guang_completed
- archived

### orders

Payment will be added later. MVP order records can start as unpaid placeholders.

Fields:

- id
- user_id
- status
- subtotal
- service_total
- shipping_total
- currency
- payment_status
- customer_email
- shipping_address_json
- created_at
- updated_at

Statuses:

- draft
- pending_payment
- paid
- kai_guang_pending
- recording_pending
- fulfillment_pending
- shipped
- completed
- cancelled

### order_items

Fields:

- id
- order_id
- product_id
- product_snapshot_json
- quantity
- dao_yin_id
- kai_guang_selected
- kai_guang_fee
- recording_selected
- recording_fee
- estimated_days_min
- estimated_days_max
- status

### consecration_jobs

Tracks the service workflow.

Fields:

- id
- order_id
- order_item_id
- dao_yin_id
- status
- temple_location
- scheduled_at
- completed_at
- operator_notes
- created_at
- updated_at

Statuses:

- pending
- scheduled
- in_progress
- completed
- cancelled

### consecration_recordings

Stores recorded consecration metadata. Video files live in R2.

Fields:

- id
- consecration_job_id
- dao_yin_id
- r2_object_key
- duration_seconds
- review_status
- customer_visible
- uploaded_at

Review statuses:

- uploaded
- approved
- rejected

## API Surface

Current repository scaffold:

- `GET /api/health`
- `GET /api/account?userId=...`
- `GET /api/readings?userId=...`
- `POST /api/readings`
- `GET /api/readings/:id?userId=...`
- `GET /api/share/readings/:token`
- `GET /api/hexagrams`
- `GET /api/hexagrams/:id`
- `GET /api/dao-yin-ids?status=available`
- `POST /api/dao-yin-ids`
- `POST /api/orders/draft`
- `GET /api/orders/:id?userId=...`
- `PATCH /api/orders/:id`
- `GET /api/consecration-jobs?status=pending`
- `POST /api/consecration-jobs`
- `GET /api/consecration-jobs/:id`
- `PATCH /api/consecration-jobs/:id`
- `GET /api/consecration-recordings?jobId=...`
- `POST /api/consecration-recordings`

The current scaffold keeps admin-only endpoints simple while the admin permission model is still undecided. Before production launch, DaoYin ID creation and order operations should be protected behind authenticated admin or customer sessions.

### Oracle

- `POST /api/readings`
  Creates one oracle reading after validating daily limit.

- `GET /api/readings/:id`
  Loads a private reading for the owner.

- `GET /api/share/readings/:token`
  Loads a public reading with private fields removed.

- `POST /api/readings/:id/share`
  Creates or updates a public share token. Can hide the question.

### Account

- `POST /api/auth/start`
  Sends login code.

- `POST /api/auth/verify`
  Verifies login code and creates session.

- `GET /api/account`
  Loads profile, readings, orders.

### DaoYin ID

- `GET /api/admin/dao-yin-ids`
- `POST /api/admin/dao-yin-ids`
- `PATCH /api/admin/dao-yin-ids/:id`

### Orders Without Payment

- `POST /api/orders/draft`
- `PATCH /api/orders/:id`
- `GET /api/orders/:id`
- `GET /api/account/orders`

### Kai Guang Workflow

- `POST /api/admin/consecration-jobs`
- `PATCH /api/admin/consecration-jobs/:id`
- `POST /api/admin/consecration-recordings`
- `PATCH /api/admin/consecration-recordings/:id`

### Content Management

- `GET /api/hexagrams`
- `GET /api/hexagrams/:id`
- `PATCH /api/admin/hexagrams/:id`
- `PATCH /api/admin/yao-texts/:id`

## Content Rules

### Chinese Cultural Symbols

Keep these in Chinese even on English UI:

- Hexagram names
- Bagua terms: 乾、兑、离、震、巽、坎、艮、坤
- Yi Jing original text
- Oracle slip poems
- DaoYin ID label: 道印编号
- Kai Guang label: 开光

### English Copy

English should explain, not replace, the Chinese cultural symbols.

Style:

- premium lifestyle
- calm
- restrained
- not mystical hype
- no guaranteed outcomes
- no medical, financial, or legal promises

### Disclaimer Rules

Oracle content should include:

- Reflection and cultural experience framing
- No guaranteed prediction claims
- No medical diagnosis
- No investment or legal advice
- Encourage users to make practical decisions responsibly

## Admin Modules

### Reading Management

Admin can view:

- reading count by day
- public share count
- most common question types
- reading text status

Admin should not casually expose birth data.

### Content Management

Admin can edit:

- hexagram interpretation
- line interpretation
- recommendation tags
- risk notes
- display status

### DaoYin ID Management

Admin can:

- import ID batches
- reserve an ID
- assign an ID to an order item
- mark ID as sold or archived

### Kai Guang Operations

Admin can:

- see pending jobs
- schedule ritual work
- mark completion
- upload recording
- approve recording for customer visibility

## MVP Milestones

### Milestone 1: Public Sharing Fix

Status: implemented in static prototype.

Current behavior:

- Copy Link creates a public share payload in the URL.
- Shared link can open on another device without local browser storage.
- Birth data, order data, and product prices are excluded.

Later backend behavior:

- Store public share records in database.
- Replace long URL payload with short `/r/:token` links.

### Milestone 2: Database Foundation

Status: scaffolded in repository.

Create D1 tables:

- users
- oracle_readings
- hexagrams
- yao_texts
- orders
- order_items
- dao_yin_ids
- consecration_jobs
- consecration_recordings

Implementation file:

- `database/schema.sql`

### Milestone 3: Reading API

Status: scaffolded, pending D1 binding and frontend integration.

Move oracle creation from localStorage to API:

- daily limit enforced in database
- reading persisted
- account history works across devices
- public share token generated server-side

Implementation files:

- `functions/api/readings/index.js`
- `functions/api/readings/[id].js`
- `functions/api/share/readings/[token].js`

### Milestone 4: Admin Workflow

Status: partially scaffolded for DaoYin ID and order draft records.

Build admin views for:

- readings
- content
- orders
- DaoYin IDs
- Kai Guang jobs
- recordings

Implementation files:

- `functions/api/account.js`
- `functions/api/dao-yin-ids/index.js`
- `functions/api/orders/draft.js`
- `functions/api/orders/[id].js`
- `functions/api/hexagrams/index.js`
- `functions/api/hexagrams/[id].js`
- `functions/api/consecration-jobs/index.js`
- `functions/api/consecration-jobs/[id].js`
- `functions/api/consecration-recordings/index.js`

### Milestone 5: Payment Integration

Deferred.

When ready, integrate payment after order draft creation and before fulfillment status changes to paid.
