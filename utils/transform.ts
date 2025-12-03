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