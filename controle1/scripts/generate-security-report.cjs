const fs = require('fs')
const path = require('path')

function generateReport() {
  const reportsDir = path.join(process.cwd(), 'reports')

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  let eslintData = []
  let auditData = {
    metadata: {
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, total: 0 },
    },
    vulnerabilities: {},
  }

  try {
    const eslintPath = path.join(reportsDir, 'eslint-security.json')
    if (fs.existsSync(eslintPath)) {
      eslintData = JSON.parse(fs.readFileSync(eslintPath, 'utf8'))
    }
  } catch (e) {
    console.warn('⚠️  Impossible de lire eslint-security.json:', e.message)
  }

  try {
    const auditPath = path.join(reportsDir, 'npm-audit.json')
    if (fs.existsSync(auditPath)) {
      auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'))
    }
  } catch (e) {
    console.warn('⚠️  Impossible de lire npm-audit.json:', e.message)
  }

  const eslintIssues = eslintData.flatMap((file) =>
    file.messages.map((msg) => ({
      file:
        file.filePath.split('controle1\\').pop() ||
        file.filePath.split('controle1/').pop() ||
        file.filePath,
      line: msg.line,
      column: msg.column,
      severity: msg.severity === 2 ? '🔴 Error' : '⚠️ Warning',
      rule: msg.ruleId || 'unknown',
      message: msg.message,
    }))
  )

  const errorCount = eslintIssues.filter(
    (i) => i.severity === '🔴 Error'
  ).length
  const warningCount = eslintIssues.filter(
    (i) => i.severity === '⚠️ Warning'
  ).length
  const vulns = auditData.metadata?.vulnerabilities || {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    total: 0,
  }

  // Extraire les détails des vulnérabilités
  const vulnerabilityDetails = []
  if (auditData.vulnerabilities) {
    for (const [pkgName, vuln] of Object.entries(auditData.vulnerabilities)) {
      vulnerabilityDetails.push({
        name: pkgName,
        severity: vuln.severity,
        title: vuln.title || vuln.name || 'Vulnérabilité détectée',
        via: vuln.via ? (Array.isArray(vuln.via) ? vuln.via : [vuln.via]) : [],
        range: vuln.range || 'N/A',
        fixAvailable: vuln.fixAvailable,
      })
    }
  }

  const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3 }
  vulnerabilityDetails.sort(
    (a, b) =>
      (severityOrder[a.severity] || 999) - (severityOrder[b.severity] || 999)
  )

  const getSeverityBadge = (severity) => {
    const badges = {
      critical:
        '<span style="background: #dc3545; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">🔴 CRITIQUE</span>',
      high: '<span style="background: #fd7e14; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">🟠 ÉLEVÉE</span>',
      moderate:
        '<span style="background: #ffc107; color: #333; padding: 4px 12px; border-radius: 4px; font-weight: bold;">🟡 MODÉRÉE</span>',
      low: '<span style="background: #28a745; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">🟢 FAIBLE</span>',
    }
    return badges[severity] || severity
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔒 Rapport de Sécurité - Controle1</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header p { font-size: 1.2em; opacity: 0.9; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }
    .card:hover { transform: translateY(-5px); }
    .card-title {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .card-value { font-size: 3em; font-weight: bold; margin-bottom: 10px; }
    .critical { color: #dc3545; }
    .high { color: #fd7e14; }
    .moderate { color: #ffc107; }
    .low { color: #28a745; }
    .error { color: #dc3545; }
    .warning { color: #ffc107; }
    .section {
      padding: 40px;
      border-bottom: 1px solid #e9ecef;
    }
    .section h2 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    .vuln-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .vuln-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .vuln-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .vuln-title {
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
      font-family: monospace;
    }
    .vuln-body { color: #666; line-height: 1.6; }
    .vuln-detail {
      margin: 10px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 5px;
    }
    .vuln-detail strong { color: #667eea; }
    .fix-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .fix-available { background: #d4edda; color: #155724; }
    .fix-unavailable { background: #f8d7da; color: #721c24; }
    .issue-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .issue-table th {
      background: #667eea;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    .issue-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e9ecef;
      word-break: break-word;
    }
    .issue-table tr:hover { background: #f8f9fa; }
    .file-path {
      color: #667eea;
      font-family: monospace;
      font-size: 0.9em;
    }
    .rule-badge {
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-family: monospace;
    }
    .footer {
      background: #2c3e50;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .no-issues {
      text-align: center;
      padding: 40px;
      color: #28a745;
      font-size: 1.2em;
    }
    .timestamp { color: rgba(255,255,255,0.7); font-size: 0.9em; }
    .alert {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .alert.danger { background: #f8d7da; border-left-color: #dc3545; }
    .alert.success { background: #d4edda; border-left-color: #28a745; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Rapport de Sécurité</h1>
      <p>Projet: <strong>Controle1</strong> (Electron App)</p>
      <p class="timestamp">Généré le: ${new Date().toLocaleString('fr-FR')}</p>
    </div>

    <div class="summary">
      <div class="card">
        <div class="card-title">Vulnérabilités Critiques</div>
        <div class="card-value critical">${vulns.critical}</div>
      </div>
      <div class="card">
        <div class="card-title">Vulnérabilités Élevées</div>
        <div class="card-value high">${vulns.high}</div>
      </div>
      <div class="card">
        <div class="card-title">Erreurs ESLint</div>
        <div class="card-value error">${errorCount}</div>
      </div>
      <div class="card">
        <div class="card-title">Warnings ESLint</div>
        <div class="card-value warning">${warningCount}</div>
      </div>
    </div>

    <div class="section">
      <h2>📦 Détails des Vulnérabilités npm</h2>
      ${
        vulnerabilityDetails.length === 0
          ? '<div class="no-issues">✅ Aucune vulnérabilité détectée !</div>'
          : `<p style="margin-bottom: 20px; color: #666;">
          <strong>${vulnerabilityDetails.length}</strong> vulnérabilité(s) détectée(s)
        </p>
        ${vulnerabilityDetails
          .map(
            (vuln) => `
          <div class="vuln-card">
            <div class="vuln-header">
              <div class="vuln-title">${vuln.name}</div>
              <div>
                ${getSeverityBadge(vuln.severity)}
                ${
                  vuln.fixAvailable
                    ? '<span class="fix-badge fix-available">✓ Fix disponible</span>'
                    : '<span class="fix-badge fix-unavailable">✗ Pas de fix</span>'
                }
              </div>
            </div>
            <div class="vuln-body">
              <div class="vuln-detail">
                <strong>Description:</strong> ${vuln.title}
              </div>
              ${
                vuln.range !== 'N/A'
                  ? `
              <div class="vuln-detail">
                <strong>Versions affectées:</strong> <code>${vuln.range}</code>
              </div>`
                  : ''
              }
              ${
                vuln.fixAvailable
                  ? `
              <div class="vuln-detail" style="background: #d4edda;">
                <strong>✓ Solution:</strong> Exécutez <code style="background: white; padding: 2px 6px; border-radius: 3px;">npm audit fix</code>
              </div>`
                  : `
              <div class="vuln-detail" style="background: #f8d7da;">
                <strong>✗ Attention:</strong> Aucun correctif automatique disponible
              </div>`
              }
            </div>
          </div>
        `
          )
          .join('')}
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p style="margin-bottom: 10px;"><strong>Pour corriger:</strong></p>
          <code style="background: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">npm audit fix</code>
          <p style="margin-top: 15px;"><a href="npm-audit.html" target="_blank">📄 Rapport complet →</a></p>
        </div>`
      }
    </div>

    <div class="section">
      <h2>🔍 Problèmes de Code (ESLint)</h2>
      ${
        eslintIssues.length === 0
          ? '<div class="no-issues">✅ Aucun problème !</div>'
          : `<p style="margin-bottom: 20px;"><strong>${eslintIssues.length}</strong> problème(s) détecté(s)</p>
        <table class="issue-table">
          <thead>
            <tr><th>Sévérité</th><th>Fichier</th><th>Ligne</th><th>Règle</th><th>Message</th></tr>
          </thead>
          <tbody>
            ${eslintIssues
              .map(
                (issue) => `
              <tr>
                <td>${issue.severity}</td>
                <td class="file-path">${issue.file}</td>
                <td>${issue.line}:${issue.column}</td>
                <td><span class="rule-badge">${issue.rule}</span></td>
                <td>${issue.message}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>`
      }
    </div>

    <div class="footer">
      <p>Rapport généré automatiquement</p>
      <p style="margin-top: 10px;">Joaquim Moysan, Lyam Bathalon, François Santerre</p>
    </div>
  </div>
</body>
</html>`

  const reportPath = path.join(reportsDir, 'security-report.html')
  fs.writeFileSync(reportPath, html)
  console.log('✅ Rapport: reports/security-report.html')

  console.log('\n📊 RÉSUMÉ')
  console.log('━'.repeat(60))
  console.log(`🔴 Critiques: ${vulns.critical} | 🟠 Élevées: ${vulns.high}`)
  console.log(`❌ Erreurs: ${errorCount} | ⚠️ Warnings: ${warningCount}`)
  console.log('━'.repeat(60))
}

try {
  generateReport()
} catch (error) {
  console.error('❌ Erreur:', error.message)
  process.exit(1)
}
