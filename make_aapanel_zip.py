import os
import zipfile
import shutil

root_dir = r"C:\Users\Administrator\Downloads\longa\longa"
dist_dir = os.path.join(root_dir, "dist")
backend_dir = os.path.join(root_dir, "backend")
output_zip = os.path.join(root_dir, "longa_aapanel_deploy_package.zip")

print("Packaging Longa aaPanel Deployment Package...")

with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add dist files to root of zip
    if os.path.exists(dist_dir):
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dist_dir)
                zipf.write(file_path, rel_path)
                print(f"Added frontend: {rel_path}")

    # 2. Add frontend .htaccess for SPA routing
    frontend_htaccess = """<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^api/ - [L]
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
"""
    zipf.writestr(".htaccess", frontend_htaccess)
    print("Added frontend .htaccess")

    # 3. Add backend files to api/ directory inside zip
    if os.path.exists(backend_dir):
        for root, dirs, files in os.walk(backend_dir):
            for file in files:
                # skip node_modules, temp or log files
                if file.endswith(".log") or "node_modules" in root:
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, backend_dir)
                zipf.write(file_path, os.path.join("api", rel_path))
                print(f"Added backend: api/{rel_path}")

print(f"\nSUCCESS! Package created at:\n{output_zip}")
print(f"Size: {os.path.getsize(output_zip) / (1024*1024):.2f} MB")
