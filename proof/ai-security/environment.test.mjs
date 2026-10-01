import test from 'node:test';
import assert from 'node:assert/strict';
import {subscriptionEnvironment,codexEnvironment} from './environment.mjs';

// Original test bodies. All input values are synthetic.
test('child environment excludes every credential, provider and runtime override', () => {
  const result = subscriptionEnvironment({ Path: 'safe-path', HOME: 'safe-home', CLAUDE_CONFIG_DIR: 'safe-auth-location', ANTHROPIC_API_KEY: 'never-pass', ANTHROPIC_AUTH_TOKEN: 'never-pass', ANTHROPIC_BASE_URL: 'never-pass', CLAUDE_CODE_OAUTH_TOKEN: 'never-pass', CLAUDE_CODE_USE_BEDROCK: 'never-pass', CLAUDE_CODE_MAX_OUTPUT_TOKENS: '1', OPENAI_API_KEY: 'never-pass', OPENAI_BASE_URL: 'never-pass', AWS_SECRET_ACCESS_KEY: 'never-pass', UNKNOWN_PROVIDER_API_KEY: 'never-pass', HTTP_PROXY: 'never-pass', NODE_OPTIONS: 'never-pass' });
  assert.deepEqual(result, { Path: 'safe-path', HOME: 'safe-home', CLAUDE_CONFIG_DIR: 'safe-auth-location', DISABLE_AUTOUPDATER: '1', CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1', CLAUDE_CODE_MAX_OUTPUT_TOKENS: '64000' });
});

test('Codex environment keeps only its sign-in location and operating-system basics', () => {
  const result = codexEnvironment({ Path: 'safe-path', HOME: 'safe-home', CODEX_HOME: 'safe-auth-location', OPENAI_API_KEY: 'never-pass', CODEX_API_KEY: 'never-pass', CODEX_ACCESS_TOKEN: 'never-pass', OPENAI_BASE_URL: 'never-pass', ANTHROPIC_API_KEY: 'never-pass', HTTP_PROXY: 'never-pass', NODE_OPTIONS: 'never-pass' });
  assert.deepEqual(result, { Path: 'safe-path', HOME: 'safe-home', CODEX_HOME: 'safe-auth-location' });
});
