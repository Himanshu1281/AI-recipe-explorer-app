// Helper to parse time strings like "15 minutes" or "1 hour" into minutes
export const parsePrepTime = (timeStr: string): number => {
  if (!timeStr) return Infinity;
  const time = timeStr.toLowerCase();
  const number = parseInt(time, 10) || 0;
  if (time.includes('hour')) {
    return number * 60;
  }
  return number;
};
