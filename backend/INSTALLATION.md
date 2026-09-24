# 🚀 Longa Social Platform - Mwongozo wa Installation & Setup

Mwongozo huu utakusaidia kusanidi na kuendesha mradi wa **Longa** (Frontend ya React 18 / Vite na Backend ya PHP PDO REST API) kwenye mazingira ya kawaida ya kienyeji (Localhost) au kwenye Seva (aaPanel, cPanel, VPS).

---

## 🔑 Akaunti za Majaribio (Default Sample Accounts)
Baada ya ku-run migrations za database, akaunti zifuatazo zinakuwa tayari kwa kuingia moja kwa moja:

| Jina | Barua Pepe | Nenosiri (Password) | Handle |
| :--- | :--- | :--- | :--- |
| **Amani Joseph** (Default) | `amani@example.com` | `password123` | `@amani` |
| **Zawadi Innovation** | `zawadi@example.com` | `password123` | `@zawadi` |
| **Baraka Digital** | `baraka@example.com` | `password123` | `@baraka` |
| **Neema Tech** | `neema@example.com` | `password123` | `@neema` |

> 💡 **Kidokezo cha Haraka:** Ikiwa unataka kuutazama mradi bila kuunganisha database mara moja, bonyeza kitufe cha **"⚡ Explore Longa (Instant Demo Mode)"** kwenye ukurasa wa kuingia (Login screen).

---

## 💻 1. Kuendesha Localhost (Local Development)

### Mahitaji (Prerequisites):
- **PHP 7.4+** au **PHP 8.x** ikiwa na extension za `pdo`, `pdo_mysql` au `pdo_pgsql`, `openssl`, `mbstring`.
- **Node.js 18+** na npm.
- **MySQL 5.7+ / 8.0+** au **PostgreSQL 10+**.

### Hatua ya A: Weka Database
1. Fungua MySQL / phpMyAdmin yako kisha unda database:
   ```sql
   CREATE DATABASE longa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Ingiza muundo wa majedwali na data za majaribio:
   ```bash
   mysql -u root -p longa_db < backend/database/migrations.sql
   ```
   *(Kwa watumiaji wa PostgreSQL: tumia `psql -d longa_db -f backend/database/migrations_pgsql.sql`)*

### Hatua ya B: Washa PHP Backend API
Kwenye folda kuu ya mradi au ndani ya `backend`:
```bash
# Kutoka kwenye mzizi wa mradi (longa):
php -S localhost:8000 -t backend
```
API itakuwa hewani kwenye: `http://localhost:8000/`  
Unaweza kuifungua browser na utaona:
```json
{"status":"ok","message":"Longa API is running","version":"1.0.0"}
```

### Hatua ya C: Washa Frontend (React/Vite)
Kwenye dirisha jipya la terminal:
```bash
npm install
npm run dev
```
Mfumo utakupa kiungo (kwa mfano `http://localhost:5173`). Ukifungua kiungo hicho, utaweza kuingia kwa `amani@example.com` na nenosiri `password123`.

---

## 🌐 2. Deployment kwenye aaPanel au cPanel (Production)

### A. Mpangilio wa Mafaili (Directory Layout)
Kwenye server (mfano `public_html`), unaweza kuweka mafaili kwa mtindo huu:

```text
public_html/
├── index.html              <-- Kutoka kwenye 'dist/' ya frontend
├── assets/                 <-- Kutoka kwenye 'dist/assets/'
├── vite.svg
├── .htaccess               <-- Kwa ajili ya React SPA routing
└── api/                    <-- Weka maudhui yote ya folda ya 'backend' hapa
    ├── index.php
    ├── .htaccess           <-- Tayari imesanidiwa kwa ajili ya routing na CORS
    ├── config/
    │   └── database.php
    ├── core/
    ├── controllers/
    └── database/
```

### B. Usanidi wa Database (Environment Variables au config)
Unaweza kusanidi database kwa njia mbili:
1. **Njia ya Mazingira (Environment Variables - Inapendekezwa):**
   Weka vigezo kwenye `.htaccess` au server environment:
   ```apache
   SetEnv DB_HOST "localhost"
   SetEnv DB_NAME "longa_db"
   SetEnv DB_USER "jina_la_user_wa_db"
   SetEnv DB_PASS "nenosiri_imara_la_db"
   SetEnv JWT_SECRET "tengeneza_neno_siri_refu_la_siri_zaidi_hapa_12345"
   ```
2. **Njia ya faili `backend/config/database.php`:**
   Fungua `backend/config/database.php` na ujaze maelezo yako ya `mysql` au `pgsql`.

### C. Ku-build Frontend kwa ajili ya Production
Kwenye kompyuta yako kabla ya ku-upload:
```bash
# Ikiwa unataka kubadilisha API URL maalum:
# Unda faili ya .env.production yenye:
# VITE_API_URL=https://domain-yako.com/api

npm run build
```
Folda itakayozalishwa inaitwa `dist/`. Nakili maudhui yote ya ndani ya `dist/` na uyaweke kwenye `public_html/`.

### D. Usalama wa Apache na Ruhusa (Permissions)
Hakikisha moduli ya `mod_rewrite` imewashwa kwenye Apache.
Ruhusa za mafaili zinazopendekezwa:
- Folda: `755`
- Mafaili ya kawaida: `644`
- Faili ya `.htaccess` ndani ya `api/` inahakikisha tokeni za `Authorization: Bearer <token>` hazikatwi na Apache.

---

## 🔒 3. Vipengele vya Usalama Vilivyoboreshwa (Security & Fixes)
- ✅ **Kuzuia kuvuja kwa Passwords:** Endpoints za `/users` na `/users/{id}` hazitoi tena `password_hash`.
- ✅ **Uthibitishaji wa Umiliki wa Machapisho (IDOR Protection):** Mtumiaji hawezi kufuta au kubadilisha chapisho la mtu mwingine; mfumo unathibitisha `user_id` kutoka kwenye JWT iliyosainiwa.
- ✅ **Saini Salama ya JWT:** Tokeni hutumia HMAC-SHA256 yenye `hash_equals` (timing-attack resistant) na secret inayobadilika.
- ✅ **CORS & Preflight Handling:** Maombi ya `OPTIONS` yanajibiwa kwa msimbo sahihi wa `200 OK` na headers zote stahiki.
- ✅ **Database Migration Parity:** Migrations zote za MySQL na PostgreSQL zinalingana kwa ukamilifu zikiwa na meza za `users`, `posts`, `comments`, `likes`, `retweets`, `bookmarks`, `follows`, `messages`, `notifications`, `email_verifications`, na `password_resets`.
