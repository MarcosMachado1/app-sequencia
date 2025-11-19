/**
 * 🎨 Font Configuration for Lasy AI Templates
 * 
 * All fonts are installed via @fontsource packages and ready to use.
 * Import any font you need in your components or layout.
 */

// Apenas as fontes que estão instaladas no seu package.json
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'

/**
 * Font family configurations for easy use
 */
export const fontFamilies = {
  // Sans-serif fonts
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  
  // Monospace fonts
  firaCode: '"Fira Code", ui-monospace, SFMono-Regular, monospace',
} as const

/**
 * CSS custom properties for fonts (use in globals.css)
 */
export const fontCSSVars = `
  --font-inter: ${fontFamilies.inter};
  --font-fira-code: ${fontFamilies.firaCode};
`

/**
 * Tailwind CSS font family configuration
 * Add this to your tailwind.config.js
 */
export const tailwindFontConfig = {
  fontFamily: {
    'inter': ['var(--font-inter)'],
    'fira-code': ['var(--font-fira-code)'],
  }
}

/**
 * Usage Examples:
 * 
 * 1. In CSS/Tailwind:
 *    className="font-inter"
 *    className="font-fira-code"
 * 
 * 2. In styled-components:
 *    font-family: ${fontFamilies.inter};
 * 
 * 3. In component styles:
 *    style={{ fontFamily: fontFamilies.inter }}
 * 
 * 4. For AI: All fonts are available, just import this file and use the fontFamilies object
 */
