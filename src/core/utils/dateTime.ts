export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function minutesToMs(minuets: number): number {
  return secondsToMs(minuets * 60);
}

export function hoursToMs(hours: number): number {
  return minutesToMs(hours * 60);
}

export function daysToMs(days: number): number {
  return hoursToMs(days * 24);
}
