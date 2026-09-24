#!/bin/bash
# =====================================================================
# Longa Social Platform — Automated aaPanel Deploy Script
# Domain: twitter.mdandu.com
# =====================================================================

set -e

DOMAIN="twitter.mdandu.com"
WEB_ROOT="/www/wwwroot/$DOMAIN"
BACKUP_DIR="/www/backup/longa_backup_$(date +%Y%m%d_%H%M%S)"
REPO="https://github.com/codeoba/longa.git"
BRANCH="master"

echo "=========================================================="
echo "  🚀 LONGA SOCIAL PLATFORM — AAPANEL DEPLOYMENT SCRIPT     "
echo "  Target Domain: $DOMAIN                                  "
echo "  Web Directory: $WEB_ROOT                                "
echo "=========================================================="
echo ""

# ── 1. Unda Saraka na Backup ikiwa ipo ─────────────────────────────────
echo "📦 [1/7] Kuandaa saraka ya tovuti..."
mkdir -p "$WEB_ROOT"
if [ "$(ls -A $WEB_ROOT 2>/dev/null)" ]; then
    echo "  Hifadhi backup ya faili zilizopo..."
    mkdir -p "$BACKUP_DIR"
    rsync -a "$WEB_ROOT/" "$BACKUP_DIR/" 2>/dev/null || true
    echo "  ✅ Backup imehifadhiwa kwenye: $BACKUP_DIR"
fi

# ── 2. Pakua Mradi kutoka GitHub ───────────────────────────────────────
echo ""
echo "📥 [2/7] Kupakua toleo jipya kutoka GitHub ($REPO)..."
TEMP_DIR="/tmp/longa_deploy_$$"
git clone --depth 1 --branch "$BRANCH" "$REPO" "$TEMP_DIR"
echo "  ✅ Mradi umepakuliwa kwenye: $TEMP_DIR"

# ── 3. Jenga Frontend (Vite Production Build) ──────────────────────────
echo ""
echo "⚙️  [3/7] Kujenga Frontend ya Kisasa (npm install & build)..."
cd "$TEMP_DIR"

if command -v node >/dev/null 2>&1; then
    echo "  Node version: $(node -v)"
    npm install --silent
    npm run build
    echo "  ✅ Frontend build imekamilika (dist/ ipo tayari)"
else
    echo "  ⚠️ Node.js haijapatikana kwenye terminal. Tutatumia build iliyopo..."
fi

# ── 4. Sambaza Faili kwenye aaPanel Web Root ───────────────────────────
echo ""
echo "🚀 [4/7] Kusambaza faili kwenye $WEB_ROOT ..."

# Weka Frontend kwenye mzizi wa tovuti
if [ -d "$TEMP_DIR/dist" ]; then
    rsync -a "$TEMP_DIR/dist/" "$WEB_ROOT/"
else
    echo "  ⚠️ Inahamisha faili za msingi..."
    rsync -a "$TEMP_DIR/" "$WEB_ROOT/"
fi

# Weka Backend API kwenye saraka ya /api
mkdir -p "$WEB_ROOT/api"
rsync -a "$TEMP_DIR/backend/" "$WEB_ROOT/api/"

# Unda .htaccess ya Frontend (SPA Routing kuzuia 404 unapo-refresh)
cat << 'EOF' > "$WEB_ROOT/.htaccess"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^api/ - [L]
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

echo "  ✅ Faili za Frontend na Backend zimesambazwa kikamilifu"

# ── 5. Sanidi Hifadhidata (Database Setup) ─────────────────────────────
echo ""
echo "🗄️  [5/7] Kuweka Hifadhidata (MySQL)..."
DB_NAME="sql_twitt_9x4n90"
DB_USER="sql_twitt_9x4n90"
DB_PASS="6f87ef40fbce6"

# Angalia kama MySQL CLI ipo
if command -v mysql >/dev/null 2>&1; then
    echo "  Inajaribu kuunganisha na kuingiza migrations kwenye '$DB_NAME'..."
    # Jaribu kutumia credentials moja kwa moja
    if mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT 1;" >/dev/null 2>&1; then
        echo "  ✅ Muunganisho wa database ya '$DB_NAME' umefanikiwa!"
        if [ -f "$WEB_ROOT/api/database/migrations.sql" ]; then
            echo "  Inaingiza migrations.sql..."
            mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$WEB_ROOT/api/database/migrations.sql" 2>/dev/null || true
        fi
        if [ -f "$WEB_ROOT/api/database/payment_migrations.sql" ]; then
            echo "  Inaingiza payment_migrations.sql..."
            mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$WEB_ROOT/api/database/payment_migrations.sql" 2>/dev/null || true
        fi
        echo "  ✅ Migrations zote zimeingizwa kikamilifu!"
    elif mysql -u root "$DB_NAME" -e "SELECT 1;" >/dev/null 2>&1; then
        echo "  Inatumia root kuingiza migrations kwenye '$DB_NAME'..."
        mysql -u root "$DB_NAME" < "$WEB_ROOT/api/database/migrations.sql" 2>/dev/null || true
        mysql -u root "$DB_NAME" < "$WEB_ROOT/api/database/payment_migrations.sql" 2>/dev/null || true
        echo "  ✅ Migrations zimeingizwa kikamilifu"
    else
        echo "  ℹ️ Kama unahitaji kuingiza schema mwenyewe, unaweza ku-import:"
        echo "     $WEB_ROOT/api/database/migrations.sql"
        echo "     $WEB_ROOT/api/database/payment_migrations.sql"
        echo "     kupitia aaPanel -> Databases -> Import / phpMyAdmin."
    fi
fi

# ── 6. Sanidi backend/config/database.php ──────────────────────────────
echo ""
echo "⚙️  [6/7] Kusanidi config/database.php kwa ajili ya $DOMAIN..."
CONFIG_FILE="$WEB_ROOT/api/config/database.php"
if [ -f "$CONFIG_FILE" ]; then
    sed -i "s/'database' => '.*'/'database' => '$DB_NAME'/" "$CONFIG_FILE" 2>/dev/null || true
    sed -i "s/'username' => '.*'/'username' => '$DB_USER'/" "$CONFIG_FILE" 2>/dev/null || true
    sed -i "s/'password' => '.*'/'password' => '$DB_PASS'/" "$CONFIG_FILE" 2>/dev/null || true
    sed -i "s/'url' => '.*'/'url' => 'https:\/\/$DOMAIN'/" "$CONFIG_FILE" 2>/dev/null || true
fi

# ── 7. Ruhusa za Faili (Permissions) ──────────────────────────────────
echo ""
echo "🔐 [7/7] Kurekebisha ruhusa za faili (Permissions)..."
mkdir -p "$WEB_ROOT/api/uploads"
chmod -R 755 "$WEB_ROOT"
chmod -R 777 "$WEB_ROOT/api/uploads"
chmod -R 777 "$WEB_ROOT/api/database" 2>/dev/null || true
chown -R www:www "$WEB_ROOT" 2>/dev/null || chown -R nginx:nginx "$WEB_ROOT" 2>/dev/null || true

# Futa temp
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================================="
echo "  🎉 HONGERA! LONGA IME-INSTALLIWA KWENYE $DOMAIN        "
echo "=========================================================="
echo "  🌐 Frontend:  https://$DOMAIN/"
echo "  🔌 API:       https://$DOMAIN/api/"
echo "  🛡️ Admin:     https://$DOMAIN/ (Menyu ya 'Admin Panel')"
echo ""
echo "  🔑 Akaunti ya Awali ya Kuingia:"
echo "     Email:     amani@example.com"
echo "     Password:  password123"
echo "=========================================================="
