export function getNameInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  if (!first && !last) return '';

  const firstInitial = first.charAt(0);
  const lastInitial = last.charAt(0);

  if (firstInitial && lastInitial) {
    return (firstInitial + lastInitial).toUpperCase();
  }

  return first.substring(0, 2).toUpperCase();
}
