// Language Detection Utilities for OrderFi AI
import { aiPrompts, type SupportedLanguage } from '../../shared/i18n';

// Simple language detection based on common patterns
export function detectMessageLanguage(message: string): SupportedLanguage {
  const text = message.toLowerCase();
  
  // Spanish indicators
  const spanishWords = ['hola', 'quiero', 'quería', 'por favor', 'gracias', 'sí', 'no', 'qué', 'cómo', 'dónde', 'cuánto', 'comida', 'bebida'];
  const spanishMatches = spanishWords.filter(word => text.includes(word)).length;
  
  // Portuguese indicators
  const portugueseWords = ['olá', 'quero', 'por favor', 'obrigado', 'obrigada', 'sim', 'não', 'que', 'como', 'onde', 'quanto', 'comida', 'bebida'];
  const portugueseMatches = portugueseWords.filter(word => text.includes(word)).length;
  
  // French indicators
  const frenchWords = ['bonjour', 'salut', 'je veux', 'je voudrais', 's\'il vous plaît', 'merci', 'oui', 'non', 'quoi', 'comment', 'où', 'combien'];
  const frenchMatches = frenchWords.filter(word => text.includes(word)).length;
  
  // Determine language based on highest match count
  if (spanishMatches > portugueseMatches && spanishMatches > frenchMatches && spanishMatches >= 1) {
    return 'es';
  }
  if (portugueseMatches > spanishMatches && portugueseMatches > frenchMatches && portugueseMatches >= 1) {
    return 'pt';
  }
  if (frenchMatches > spanishMatches && frenchMatches > portugueseMatches && frenchMatches >= 1) {
    return 'fr';
  }
  
  return 'en'; // Default to English
}

export function getLocalizedAIPrompt(language: SupportedLanguage): string {
  return aiPrompts[language] || aiPrompts.en;
}

export function getLanguageName(language: SupportedLanguage): string {
  const names = {
    en: 'English',
    es: 'Spanish',
    pt: 'Portuguese', 
    fr: 'French'
  };
  return names[language];
}