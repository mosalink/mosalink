/**
 * transform a string with different word and case to unique lowwer case word
 * @param name
 * @returns
 */
export function getNameToUrl(text: string): string {
  // Supprime les caractères spéciaux et les accents
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remplace les espaces et autres caractères non alphanumériques par une chaîne vide
  const transformedText = normalizedText.replace(/[^a-zA-Z0-9]/g, "");

  return transformedText;
}
