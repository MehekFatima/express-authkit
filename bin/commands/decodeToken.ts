import { Command } from 'commander';
import jwt from 'jsonwebtoken';

export const decodeCommand = new Command('decode-token')
  .description('Decode any JWT without verifying')
  .requiredOption('--token <token>', 'JWT token')
  .action((opts) => {
    try {
      if (!opts.token) {
        console.error('\n❌ Token is required.');
        process.exit(1);
      }

      const decoded = jwt.decode(opts.token, { complete: true });

      if (!decoded) {
        console.error('\n❌ Failed to decode: Invalid token format.');
        process.exit(1);
      }

      console.log('\n🧩 Decoded Token:');
      console.dir(decoded, { depth: null, colors: true });
    } catch (err: any) {
      console.error(`\n❌ Failed to decode: ${err.message}`);
      process.exit(1);
    }
  });
