/**
 * Generates initials for a supermarket name based on specific rules:
 * 1. If the name has two words, use the first letter of each word (e.g., "Carrefour Express" -> "CE").
 * 2. If the name has one word:
 *    - Use the first letter (e.g., "Carrefour" -> "C").
 *    - If that letter is already taken by another supermarket in the list, use the first two letters (e.g., "Chandarana" -> "Ch" if "C" is taken).
 * 
 * @param {string} name - The name of the supermarket.
 * @param {string[]} allNames - List of all supermarket names to check for conflicts.
 * @returns {string} The generated initials.
 */
export const getSupermarketInitials = (name, allNames = []) => {
    if (!name) return '';

    const words = name.trim().split(/\s+/);

    // Rule 1: Two or more words -> First letter of first two words
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    // Rule 2: One word
    const firstLetter = name[0].toUpperCase();

    // Check if any other supermarket starts with the same letter
    // We need to filter out the current name itself from the check if it's in the list
    const otherNames = allNames.filter(n => n.toLowerCase() !== name.toLowerCase());
    const conflict = otherNames.some(n => n.trim().split(/\s+/).length === 1 && n[0].toUpperCase() === firstLetter);

    if (conflict) {
        return name.substring(0, 2); // First two letters (mixed case usually looks better, e.g. "Ch")
    }

    return firstLetter;
};
