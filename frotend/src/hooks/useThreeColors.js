import { useMemo } from 'react';
import { useTheme } from './useTheme';
import { useVariant } from './useVariant';

/**
 * useThreeColors - Convert design system CSS variables to Three.js colors
 *
 * Returns THREE.Color-compatible values (hex numbers) for:
 * - copper, forest, forestDarker, sand, cream, accent, terracotta
 * - Background colors for fog, clear color, etc.
 * - Material presets using design tokens
 */
export function useThreeColors() {
  const { theme } = useTheme(); // 'dark' | 'light'
  const { variant } = useVariant(); // 'zellige' | 'dunes' | 'arabesque' | 'marrakech'

  return useMemo(() => {
    // Base RGB values for each variant (from DESIGN.md tokens)
    // Format: [r, g, b] in 0-255 range
    const variants = {
      zellige: {
        copper: [201, 162, 39],
        forest: [29, 90, 78],
        forestDarker: [11, 42, 37],
        sand: [236, 223, 198],
        cream: [248, 244, 233],
        accent: [184, 80, 66],
        terracotta: [196, 106, 63],
      },
      dunes: {
        copper: [201, 123, 58],
        forest: [107, 74, 53],
        forestDarker: [46, 31, 22],
        sand: [234, 219, 195],
        cream: [250, 244, 234],
        accent: [184, 80, 66],
        terracotta: [196, 106, 63],
      },
      arabesque: {
        copper: [169, 132, 47],
        forest: [31, 93, 92],
        forestDarker: [12, 40, 40],
        sand: [233, 226, 210],
        cream: [247, 245, 239],
        accent: [184, 80, 66],
        terracotta: [196, 106, 63],
      },
      marrakech: {
        copper: [217, 169, 65],
        forest: [42, 52, 51],
        forestDarker: [17, 24, 23],
        sand: [236, 225, 200],
        cream: [242, 236, 221],
        accent: [184, 80, 66],
        terracotta: [196, 106, 63],
      },
    };

    const v = variants[variant] || variants.zellige;

    // Helper to convert RGB array to THREE.Color hex
    const rgbToHex = ([r, g, b]) => (r << 16) | (g << 8) | b;

    // Helper to convert RGB array to CSS rgb() string
    const rgbToCss = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

    const colors = {
      // Primary design tokens as THREE.Color hex
      copper: rgbToHex(v.copper),
      forest: rgbToHex(v.forest),
      forestDarker: rgbToHex(v.forestDarker),
      sand: rgbToHex(v.sand),
      cream: rgbToHex(v.cream),
      accent: rgbToHex(v.accent),
      terracotta: rgbToHex(v.terracotta),

      // CSS rgb strings for HTML overlays
      copperCss: rgbToCss(v.copper),
      forestCss: rgbToCss(v.forest),
      forestDarkerCss: rgbToCss(v.forestDarker),
      sandCss: rgbToCss(v.sand),
      creamCss: rgbToCss(v.cream),
      accentCss: rgbToCss(v.accent),
      terracottaCss: rgbToCss(v.terracotta),

      // Semantic aliases
      primary: rgbToHex(v.copper),
      secondary: rgbToHex(v.forest),
      background: theme === 'dark' ? rgbToHex(v.forestDarker) : rgbToHex(v.cream),
      surface: theme === 'dark' ? rgbToHex([v.forestDarker[0] + 10, v.forestDarker[1] + 10, v.forestDarker[2] + 10]) : rgbToHex(v.sand),
      text: theme === 'dark' ? rgbToHex(v.sand) : rgbToHex(v.forestDarker),
      textMuted: theme === 'dark' ? rgbToHex([v.sand[0] * 0.7, v.sand[1] * 0.7, v.sand[2] * 0.7]) : rgbToHex([v.forestDarker[0] * 1.5, v.forestDarker[1] * 1.5, v.forestDarker[2] * 1.5]),

      // Fog/atmosphere colors
      fogColor: theme === 'dark' ? rgbToHex(v.forestDarker) : rgbToHex(v.cream),
      fogNear: 10,
      fogFar: 100,

      // Clear color (transparent by default, but can be overridden)
      clearColor: 0x000000,
      clearAlpha: 0,

      // Material presets
      materials: {
        // Standard mesh materials using design colors
        primary: {
          color: rgbToHex(v.copper),
          metalness: 0.1,
          roughness: 0.7,
        },
        secondary: {
          color: rgbToHex(v.forest),
          metalness: 0.05,
          roughness: 0.8,
        },
        accent: {
          color: rgbToHex(v.accent),
          metalness: 0.2,
          roughness: 0.5,
        },
        glass: {
          color: rgbToHex(v.cream),
          metalness: 0,
          roughness: 0.1,
          transmission: 0.9,
          transparent: true,
          opacity: 0.3,
          ior: 1.5,
        },
        sand: {
          color: rgbToHex(v.sand),
          metalness: 0,
          roughness: 0.9,
        },
        // Dark mode variants
        darkSurface: {
          color: rgbToHex(v.forestDarker),
          metalness: 0.05,
          roughness: 0.85,
        },
      },

      // Lighting presets
      lighting: {
        // Warm directional light (sun-like)
        sun: {
          color: rgbToHex([Math.min(255, v.copper[0] * 1.2), Math.min(255, v.copper[1] * 1.1), Math.min(255, v.copper[2] * 0.8)]),
          intensity: theme === 'dark' ? 2.5 : 1.5,
        },
        // Cool fill light
        fill: {
          color: rgbToHex([Math.min(255, v.forest[0] * 1.5), Math.min(255, v.forest[1] * 1.3), Math.min(255, v.forest[2] * 1.2)]),
          intensity: theme === 'dark' ? 1 : 0.5,
        },
        // Accent rim light
        rim: {
          color: rgbToHex(v.accent),
          intensity: theme === 'dark' ? 1.5 : 0.8,
        },
        // Ambient
        ambient: {
          color: rgbToHex(v.cream),
          intensity: theme === 'dark' ? 0.3 : 0.6,
        },
      },

      // Post-processing / effect colors
      effects: {
        bloomThreshold: 0.8,
        bloomStrength: theme === 'dark' ? 1.2 : 0.6,
        bloomRadius: 0.5,
        vignetteColor: rgbToHex(v.forestDarker),
      },
    };

    return { colors, materials: colors.materials, lighting: colors.lighting, effects: colors.effects };
  }, [theme, variant]);
}

/**
 * useThreeColor - Shorthand for getting a single color
 */
export function useThreeColor(colorName) {
  const { colors } = useThreeColors();
  return colors[colorName];
}

export default useThreeColors;