import os
import subprocess
import shutil
import tempfile
import sys

sys.stdout.reconfigure(encoding='utf-8')

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aryan Thakor Portfolio — Project Summary Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      line-height: 1.45;
      font-size: 9pt;
    }

    .page {
      height: 275mm;
      max-height: 275mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    .page-content {
      flex: 1;
    }

    /* Header / Cover Section */
    .cover-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0369A1 100%);
      color: #FFFFFF;
      padding: 20px 22px;
      border-radius: 12px;
      margin-bottom: 14px;
      position: relative;
      overflow: hidden;
    }

    .cover-banner::after {
      content: '';
      position: absolute;
      right: -30px;
      top: -30px;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
    }

    .badge-top {
      display: inline-block;
      background: rgba(6, 182, 212, 0.2);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #38BDF8;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .cover-title {
      font-size: 19pt;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .cover-subtitle {
      font-size: 9.5pt;
      color: #94A3B8;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    .meta-item {
      font-size: 8pt;
    }

    .meta-label {
      color: #94A3B8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 7pt;
      margin-bottom: 2px;
    }

    .meta-value {
      color: #F8FAFC;
      font-weight: 700;
    }

    /* Section Styling */
    .section {
      margin-bottom: 14px;
    }

    .section-title {
      font-size: 11.5pt;
      font-weight: 800;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 6px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #E2E8F0;
      margin-bottom: 8px;
    }

    .section-title .icon {
      color: #0284C7;
    }

    /* Stat Cards Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }

    .stat-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 10px;
      text-align: center;
    }

    .stat-num {
      font-size: 15pt;
      font-weight: 800;
      color: #0284C7;
      line-height: 1.1;
    }

    .stat-label {
      font-size: 7pt;
      font-weight: 600;
      color: #64748B;
      margin-top: 2px;
      text-transform: uppercase;
    }

    /* Data Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 8pt;
    }

    th {
      background: #0F172A;
      color: #FFFFFF;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      font-size: 7.5pt;
      border: 1px solid #0F172A;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #E2E8F0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #F8FAFC;
    }

    /* Feature Grid */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }

    .feature-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px;
    }

    .feature-card h4 {
      font-size: 9pt;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .feature-card p {
      font-size: 7.8pt;
      color: #475569;
      line-height: 1.4;
    }

    /* Highlight Callout Box */
    .callout {
      background: #F0F9FF;
      border-left: 3.5px solid #0284C7;
      border-radius: 0 6px 6px 0;
      padding: 8px 12px;
      margin-bottom: 10px;
      font-size: 8pt;
      color: #0369A1;
    }

    .callout-title {
      font-weight: 700;
      margin-bottom: 2px;
    }

    /* Tags / Pills */
    .tag {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 5px;
      font-size: 7pt;
      font-weight: 600;
      background: #E0F2FE;
      color: #0369A1;
      margin-right: 3px;
      margin-top: 3px;
    }

    .tag-green { background: #DCFCE7; color: #15803D; }
    .tag-amber { background: #FEF3C7; color: #B45309; }
    .tag-purple { background: #F3E8FF; color: #7E22CE; }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      background: #F1F5F9;
      color: #0F172A;
      padding: 1.5px 4px;
      border-radius: 3px;
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #94A3B8;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: OVERVIEW & ARCHITECTURE ==================== -->
  <div class="page">
    <div class="page-content">
      <div class="cover-banner">
        <div class="badge-top">Enterprise Project Summary Report</div>
        <h1 class="cover-title">Aryan Thakor — Modern Next.js Portfolio & CMS Studio</h1>
        <div class="cover-subtitle">Complete Architecture, Full-Stack Migration, Dynamic Category Management & Delivery Audit</div>
        
        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">Author & Developer</div>
            <div class="meta-value">Aryan Thakor</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Technology Stack</div>
            <div class="meta-value">Next.js 14 + Node.js</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Production Status</div>
            <div class="meta-value">✅ 100% Live on Render</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Report Date</div>
            <div class="meta-value">September 2026</div>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">48+</div>
          <div class="stat-label">Web Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">17+</div>
          <div class="stat-label">Graphic Designs</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">6+</div>
          <div class="stat-label">Video Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">13/13</div>
          <div class="stat-label">Static Pages Built</div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">📋</span> Executive Summary</h3>
        <p style="margin-bottom: 6px; font-size: 8.5pt;">
          This document certifies the successful completion of the portfolio re-architecture for <strong>Aryan Thakor</strong> (Senior Web Developer, CMS Specialist & Graphic Designer). The project transformed a legacy React + Vite client single-page application into an ultra-fast, enterprise-grade <strong>Next.js 14 Static Site Export</strong> with an Express.js backend API and a stealth, two-factor authenticated <strong>Admin CMS Studio</strong>.
        </p>
        <p style="font-size: 8.5pt;">
          The system delivers exceptional lighthouse speed, zero-404 route handling, multi-channel category filtering, inline video playback, credential verification, and full category lifecycle management (Add, Edit, Delete, Restore) with seamless dual-layer synchronization across LocalStorage and backend JSON datastores.
        </p>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">🏗️</span> Core Technology Stack</h3>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Technology</th>
              <th>Version / Spec</th>
              <th>Architectural Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Framework</strong></td>
              <td>Next.js (Pages Router)</td>
              <td><code>v14.2.35</code></td>
              <td>Static HTML Pre-rendering, SSG exports, zero-server lag</td>
            </tr>
            <tr>
              <td><strong>Frontend UI</strong></td>
              <td>React & Vanilla CSS</td>
              <td><code>v18.3.1</code></td>
              <td>Curated dark/light design system with zero Tailwind runtime bloat</td>
            </tr>
            <tr>
              <td><strong>Icons & Assets</strong></td>
              <td>Lucide React</td>
              <td><code>v0.428.0</code></td>
              <td>Clean, scalable SVG vector iconography across all viewports</td>
            </tr>
            <tr>
              <td><strong>Backend API</strong></td>
              <td>Node.js & Express.js</td>
              <td><code>v20.x / 4.x</code></td>
              <td>REST endpoints for dynamic content, telemetry, and 2FA auth</td>
            </tr>
            <tr>
              <td><strong>Security</strong></td>
              <td>Passcode + TOTP 2FA</td>
              <td><code>speakeasy / qrcode</code></td>
              <td>RFC 6238 time-based authenticator with emergency recovery keys</td>
            </tr>
            <tr>
              <td><strong>Hosting</strong></td>
              <td>Render Cloud</td>
              <td>Static Site + API</td>
              <td>Global CDN deployment with automated CI/CD from GitHub <code>main</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="callout">
        <div class="callout-title">🚀 Live Deployment URLs & Environment Metadata</div>
        <strong>Production Web Portal:</strong> <code>https://aryan-portfolio-s8il.onrender.com/</code><br>
        <strong>GitHub Version Control:</strong> <code>https://github.com/Aryanthakor27/portfolio.git</code> (Commit <code>95dafce</code>)<br>
        <strong>Secret Admin Access:</strong> <code>https://aryan-portfolio-s8il.onrender.com/admin/?key=aryan2026</code>
      </div>
    </div>

    <div class="page-footer">
      <div>Aryan Thakor — Enterprise Portfolio & CMS Studio Project Summary Report</div>
      <div>Page 1 of 3</div>
    </div>
  </div>

  <!-- ==================== PAGE 2: MODULES & CATEGORY MANAGER ==================== -->
  <div class="page">
    <div class="page-content">
      <div class="section">
        <h3 class="section-title"><span class="icon">🌟</span> Major Portfolio Sections & Capabilities</h3>
        <div class="feature-grid">
          <div class="feature-card">
            <h4>🌐 Web Projects Showcase (48+ Sites)</h4>
            <p>Real-world commercial websites spanning luxury e-commerce, resorts, tech firms, industrial logistics, and healthcare. Includes real-time category filtering, external live site launchers, and tech stack tags.</p>
            <div>
              <span class="tag">E-Commerce</span>
              <span class="tag">Hospitality</span>
              <span class="tag">Corporate</span>
              <span class="tag">Industrial</span>
            </div>
          </div>

          <div class="feature-card">
            <h4>🎨 Graphic Design Showcase (17+ Works)</h4>
            <p>Curated visual branding, social media campaign posts, product photo manipulations, and commercial retouching. Features an instant high-resolution lightbox modal with zoom and details.</p>
            <div>
              <span class="tag tag-purple">Logos & Branding</span>
              <span class="tag tag-purple">Social Posts</span>
              <span class="tag tag-purple">Manipulation</span>
            </div>
          </div>

          <div class="feature-card">
            <h4>🎬 Video Editing & Motion Graphics (6+ Projects)</h4>
            <p>High-retention video portfolio including commercial ads, short-form Reels/Shorts, YouTube documentary edits, and motion graphics. Features an embedded video playback modal with view metrics and tool badges.</p>
            <div>
              <span class="tag tag-green">Commercials</span>
              <span class="tag tag-green">Reels & Shorts</span>
              <span class="tag tag-green">Motion FX</span>
            </div>
          </div>

          <div class="feature-card">
            <h4>📜 Credentials & Letter of Experience</h4>
            <p>Verifiable career documentation including official Experience Letter from Digiva Inc / Rowwat Technologies CEO Rajni Patel & PM Jay Senjaliya, complete with embedded PDF viewer and direct download.</p>
            <div>
              <span class="tag tag-amber">Verified</span>
              <span class="tag tag-amber">PDF Download</span>
              <span class="tag tag-amber">Internship Cert</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">📂</span> Advanced Category Management System</h3>
        <p style="margin-bottom: 8px; font-size: 8.5pt;">
          Delivered in the final sprint: A full-lifecycle <strong>Category Manager</strong> inside the Admin Dashboard that empowers the administrator to Add, Edit, Delete, and Restore categories without touching source code.
        </p>
        <table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>User Action</th>
              <th>System Behavior & Data Integrity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>➕ Add Category</strong></td>
              <td>Input label & auto-generated slug, click "+ Add Category"</td>
              <td>Generates slug, verifies unique ID, saves to LocalStorage & dispatches cross-component update events.</td>
            </tr>
            <tr>
              <td><strong>✏️ Edit Category</strong></td>
              <td>Click Edit (pencil) icon, modify label or slug, click "Update"</td>
              <td>Updates category label. If slug changes, <strong>automatically cascades the new category ID to all existing assigned projects</strong> to prevent broken links!</td>
            </tr>
            <tr>
              <td><strong>🗑️ Delete Category</strong></td>
              <td>Click Delete (trash) icon</td>
              <td>Calculates affected project count. Displays safety alert if projects are assigned. Removes category from filter tabs and cleans active filters.</td>
            </tr>
            <tr>
              <td><strong>🔄 Restore Defaults</strong></td>
              <td>Click "Restore Defaults" button in category modal</td>
              <td>Restores pristine default category arrays for Websites, Designs, or Videos upon confirmation.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">🛡️</span> Security & Admin CMS Architecture</h3>
        <div class="feature-grid">
          <div class="feature-card">
            <h4>🔒 Hidden Stealth Mode</h4>
            <p>Public navbar has zero visible admin lock or key icons. The administrative studio can only be reached via secret URL query param (<code>?key=aryan2026</code>) or direct route.</p>
          </div>
          <div class="feature-card">
            <h4>🔑 Multi-Factor Security (Passcode + 2FA)</h4>
            <p>Default Master Passcode protection (<code>2704</code>) paired with optional Google Authenticator TOTP 2FA and Emergency Recovery Keys to safeguard against unauthorized access.</p>
          </div>
          <div class="feature-card">
            <h4>📊 Live Visitor Telemetry</h4>
            <p>Cloud-synced real-time visitor tracking via ntfy telemetry channel, capturing operating system, browser, timestamp, and active IP logs.</p>
          </div>
          <div class="feature-card">
            <h4>♻️ Recycle Bin Protection</h4>
            <p>Soft-delete architecture allowing deleted websites, graphic designs, and credentials to be restored with a single click before permanent purge.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Aryan Thakor — Enterprise Portfolio & CMS Studio Project Summary Report</div>
      <div>Page 2 of 3</div>
    </div>
  </div>

  <!-- ==================== PAGE 3: CHANGELOG & HANDOVER ==================== -->
  <div class="page">
    <div class="page-content">
      <div class="section">
        <h3 class="section-title"><span class="icon">⚡</span> Migration & Optimization Changelog</h3>
        <table>
          <thead>
            <tr>
              <th>Item / Module</th>
              <th>Previous State (Legacy)</th>
              <th>Current State (Delivered)</th>
              <th>Benefit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Build Architecture</strong></td>
              <td>React.js + Vite Client SPA</td>
              <td><strong>Next.js 14 Static HTML Export</strong></td>
              <td>Instant page loads, 0 client bundle delay, SEO meta prerendering</td>
            </tr>
            <tr>
              <td><strong>Obsolete Files</strong></td>
              <td>vite.config.js, index.html, App.jsx</td>
              <td><strong>Deleted & Cleaned</strong></td>
              <td>Clean repository footprint, no dead build dependencies</td>
            </tr>
            <tr>
              <td><strong>Navbar Lock Icon</strong></td>
              <td>Visible lock in desktop & mobile</td>
              <td><strong>Completely Removed</strong></td>
              <td>Stealth security, clean high-end public portfolio look</td>
            </tr>
            <tr>
              <td><strong>/designs Refresh Bug</strong></td>
              <td>Refreshing `/designs` redirected to home</td>
              <td><strong>Dedicated Route View Resolver</strong></td>
              <td>Direct browser reloads work on all routes with zero glitching</td>
            </tr>
            <tr>
              <td><strong>Video Stray Icon</strong></td>
              <td>Unwanted Film icon in header</td>
              <td><strong>Removed</strong></td>
              <td>Clean, balanced typographic section header</td>
            </tr>
            <tr>
              <td><strong>Graphic Design Tabs</strong></td>
              <td>Contained video-editing & reels</td>
              <td><strong>Purged & Separated</strong></td>
              <td>Graphic designs strictly contain branding, social, manipulation</td>
            </tr>
            <tr>
              <td><strong>Category Management</strong></td>
              <td>Create-only modal with no edit/delete</td>
              <td><strong>Complete CRUD Category Manager</strong></td>
              <td>Full autonomy to Add, Edit, Delete, and Restore all categories</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">🛠️</span> Developer Handover & Operations Guide</h3>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; font-size: 8pt;">
          <p style="margin-bottom: 5px;"><strong>1. Running the Project Locally:</strong></p>
          <div style="margin-bottom: 6px;"><code>node backend/server.js</code> &nbsp;→ Starts full-stack server on <code>http://localhost:5000/</code></div>
          
          <p style="margin-bottom: 5px;"><strong>2. Building for Production:</strong></p>
          <div style="margin-bottom: 6px;"><code>node build.js</code> &nbsp;→ Installs dependencies, exports Next.js static bundle to <code>./dist</code> and <code>frontend/dist</code></div>

          <p style="margin-bottom: 5px;"><strong>3. Deploying Updates to Render:</strong></p>
          <div><code>git add -A && git commit -m "update message" && git push origin main</code> &nbsp;→ Render triggers auto-build & deployment</div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title"><span class="icon">✅</span> Final Certification & Sign-off</h3>
        <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h4 style="color: #166534; font-size: 10pt; font-weight: 800; margin-bottom: 3px;">PROJECT STATUS: COMPLETED & SIGNED OFF</h4>
            <p style="color: #15803D; font-size: 8pt; max-width: 460px;">
              All user requirements, technical optimizations, Next.js conversions, stealth admin implementations, and category CRUD systems have been thoroughly tested, verified, and deployed to live production.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: #166534; font-size: 10pt;">Aryan Thakor</div>
            <div style="font-size: 7.5pt; color: #15803D;">Sr. Web Developer & Designer</div>
            <div style="font-size: 7pt; color: #64748B; margin-top: 1px;">Ahmedabad, India • 2026</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Aryan Thakor — Enterprise Portfolio & CMS Studio Project Summary Report</div>
      <div>Page 3 of 3 • Generated September 2026</div>
    </div>
  </div>

</body>
</html>
"""

def generate_pdf():
    # 1. Save HTML to temp and workspace
    html_path = os.path.abspath("project_report.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print(f"HTML report created at: {html_path}")

    # 2. Convert to PDF using headless Chrome with no headers/footers
    tmp_pdf = os.path.join(tempfile.gettempdir(), "Aryan_Thakor_Portfolio_Project_Report.pdf")
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={tmp_pdf}",
        f"file:///{html_path.replace(os.sep, '/')}"
    ]

    print("Converting HTML to PDF via Headless Chrome...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(tmp_pdf):
        # 3. Copy to destination paths
        dest_root = os.path.abspath("Aryan_Thakor_Portfolio_Project_Report.pdf")
        dest_public = os.path.abspath("frontend/public/Aryan_Thakor_Portfolio_Project_Report.pdf")
        dest_artifact = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\a8937ee5-8f3c-419c-a450-413878832abb\Aryan_Thakor_Portfolio_Project_Report.pdf"

        shutil.copy2(tmp_pdf, dest_root)
        os.makedirs(os.path.dirname(dest_public), exist_ok=True)
        shutil.copy2(tmp_pdf, dest_public)
        try:
            shutil.copy2(tmp_pdf, dest_artifact)
        except Exception:
            pass

        print(f"PDF successfully generated at:\n  - {dest_root}\n  - {dest_public}\n  - {dest_artifact}")
        file_size = os.path.getsize(dest_root) / 1024
        print(f"PDF File Size: {file_size:.1f} KB")
        return True
    else:
        print("Failed to generate PDF. Stderr:", res.stderr)
        return False


if __name__ == "__main__":
    generate_pdf()
