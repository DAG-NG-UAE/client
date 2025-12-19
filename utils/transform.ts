export const getFirstAndLastInitials = (fullName: string): string => {
    // 1. Trim whitespace and split the string by spaces to get an array of names/words.
    const names = fullName.trim().split(/\s+/);

    // Check if we have at least one name
    if (names.length === 0 || !names[0]) {
        return '';
    }
    // 2. Get the first initial (always from the first word)
    const firstInitial = names[0].charAt(0).toUpperCase();
    let lastInitial = '';

    // If there is more than one word, get the first letter of the last word
    if (names.length > 1) {
        const lastName = names[names.length - 1];
        if (lastName) {
            lastInitial = lastName.charAt(0).toUpperCase();
        }
    }

    // 4. Concatenate and return the initials
    return firstInitial + lastInitial;
}

/**
 * Converts an ISO date string into a human-readable relative time string.
 * e.g., "3 days ago", "2 weeks ago", "1 month from now"
 */
export const getRelativeTime = (isoString: string, unitOfTime?: 'days'): string => {
    const targetDate = new Date(isoString).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    const isPast = diffInSeconds >= 0;
    const absSeconds = Math.abs(diffInSeconds);

    if (unitOfTime === 'days') {
      const diffInDays = Math.floor(absSeconds / 86400); // 86400 seconds in a day
      return `${diffInDays}`;
    }
  
    // Define time scales in seconds
    const units: { label: string; seconds: number }[] = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
  
    for (const unit of units) {
      const interval = Math.floor(absSeconds / unit.seconds);
      
      if (interval >= 1) {
        return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
      }
    }
  
    return "just now";
}

export const formatRoleName = (role: string): string => {
  if (!role) return "";

  return role
    .split(/[_-]/) // Splits by underscore or hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};