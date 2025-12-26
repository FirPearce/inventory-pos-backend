/**
 * Format date to dd.mm.yyyy format
 */
export function formatDateString(date: Date | null | undefined): string | null {
  if (!date) {
    return null;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return null;
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
}

/**
 * Parse dd.mm.yyyy format string to Date
 */
export function parseDateString(
  dateString: string | null | undefined,
): Date | null {
  if (!dateString) {
    return null;
  }

  // Validate format dd.mm.yyyy
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  // Validate the date is valid (e.g., not 31.02.2024)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

/**
 * Validate if string is in dd.mm.yyyy format
 */
export function isValidDateString(dateString: string): boolean {
  return parseDateString(dateString) !== null;
}
