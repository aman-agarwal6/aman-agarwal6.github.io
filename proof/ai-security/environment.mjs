// Exact functions extracted from Downfield; see provenance.json. No credentials are read here.
export function subscriptionEnvironment(input = process.env) {
  const names = new Set(['PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP',
    'TMP', 'TMPDIR', 'USERPROFILE', 'HOME', 'HOMEDRIVE', 'HOMEPATH', 'APPDATA',
    'LOCALAPPDATA', 'PROGRAMDATA', 'SYSTEMDRIVE', 'LANG', 'LC_ALL', 'LC_CTYPE',
    'CLAUDE_CONFIG_DIR']);
  return {
    ...Object.fromEntries(Object.entries(input).filter(([name, value]) => names.has(name.toUpperCase()) && typeof value === 'string')),
    // Fixed values, never inherited: no background updates or telemetry, and
    // enough output room for a complete structured report.
    DISABLE_AUTOUPDATER: '1', CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1', CLAUDE_CODE_MAX_OUTPUT_TOKENS: '64000',
  };
}

export function codexEnvironment(input = process.env) {
  const names = new Set(['PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP',
    'TMP', 'TMPDIR', 'USERPROFILE', 'HOME', 'HOMEDRIVE', 'HOMEPATH', 'APPDATA',
    'LOCALAPPDATA', 'PROGRAMDATA', 'SYSTEMDRIVE', 'LANG', 'LC_ALL', 'LC_CTYPE',
    'CODEX_HOME', 'CODEX_SANDBOX_NETWORK_DISABLED']);
  return Object.fromEntries(Object.entries(input).filter(([name, value]) => names.has(name.toUpperCase()) && typeof value === 'string'));
}
