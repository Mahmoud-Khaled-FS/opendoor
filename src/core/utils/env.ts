export function env(key: string, defaultValue: string): string;
export function env(key: string, defaultValue?: undefined): string | undefined;
export function env(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue;
}
