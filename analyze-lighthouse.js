
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportPath = path.join(process.cwd(), 'lighthouse-report.json');

try {
  if (!fs.existsSync(reportPath)) {
    console.error('Report file not found.');
    process.exit(1);
  }

  const raw = fs.readFileSync(reportPath, 'utf8');
  const report = JSON.parse(raw);

  const performance = report.categories.performance;
  const score = performance.score * 100;
  
  let output = '';
  output += `Performance Score: ${score.toFixed(0)}\n`;

  // Get LCP Element
  const lcpAudit = report.audits['largest-contentful-paint-element'];
  if (lcpAudit && lcpAudit.details && lcpAudit.details.items && lcpAudit.details.items.length > 0) {
     output += '\n--- LCP Element ---\n';
     output += `Element: ${lcpAudit.details.items[0].node.nodeLabel}\n`;
     // output += `Snippet: ${lcpAudit.details.items[0].node.snippet}\n`; // Snippet can be long
  }

  const opportunities = Object.values(report.audits).filter(audit => 
    audit.details && 
    audit.details.type === 'opportunity' && 
    (audit.score < 0.9 || audit.score === null)
  ).sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0)).slice(0, 10);

  if (opportunities.length > 0) {
    output += '\n--- Top Opportunities ---\n';
    opportunities.forEach(opp => {
      output += `${opp.title}: ${opp.displayValue} (Score: ${(opp.score * 100).toFixed(0)})\n`;
    });
  }
  
  fs.writeFileSync('lighthouse-summary.txt', output);
  console.log('Analysis written to lighthouse-summary.txt');

} catch (error) {
  console.error('Error analyzing report:', error.message);
}
