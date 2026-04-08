import { runDailyInsightGeneration } from '../lib/dailyInsightGenerator.js';

const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');

runDailyInsightGeneration({ force, dryRun })
  .then((result) => {
    if (result?.skipped) {
      console.log(`Daily insight skipped: ${result.reason}`);
      return;
    }

    if (result?.dryRun) {
      console.log('Dry run completed.');
      return;
    }

    console.log(`Published daily insight: ${result.inserted.slug}`);
  })
  .catch((error) => {
    console.error('Failed to generate daily insight:');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  });
