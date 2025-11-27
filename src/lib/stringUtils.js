export function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-');     // Replace multiple - with single -
}

export function getSupermarketInitials(name, allNames = []) {
    if (!name) return '?';

    // If there are multiple supermarkets starting with the same letter, use 2 letters
    const firstLetter = name.charAt(0).toUpperCase();
    const conflicts = allNames.filter(n => n.toUpperCase().startsWith(firstLetter));

    if (conflicts.length > 1) {
        return name.substring(0, 2).toUpperCase();
    }

    return firstLetter;
}
