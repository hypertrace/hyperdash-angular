import { defineConfig } from 'vitest/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rxjsVersion: string = require('rxjs/package.json').version;
const isRxjs6 = rxjsVersion.startsWith('6.');

export default defineConfig({
  resolve: {
    alias: isRxjs6
      ? {
          // RxJS 6 does not expose directory imports through package exports.
          'rxjs/operators': 'rxjs/operators/index.js',
          'rxjs/testing': 'rxjs/testing/index.js'
        }
      : {}
  },
  test: {
    server: {
      deps: {
        // Ensure Vite transforms dependencies instead of externalizing to Node.
        inline: true
      }
    }
  }
});
