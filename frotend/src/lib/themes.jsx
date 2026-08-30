export const themes = [
  {
    id: 'zellige',
    name: 'Emerald & Gold Zellige',
    names: { fr: 'Zellige Émeraude & Or', en: 'Emerald & Gold Zellige', ar: 'زليج زمردي وذهبي' },
    desc: {
      fr: 'Vert émeraude profond, or et sable chaud, motifs zellige marocains.',
      en: 'Deep emerald, gold and warm sand with Moroccan zellige motifs.',
      ar: 'زمردي عميق وذهبي ورمل دافئ بزخارف الزليج المغربي.',
    },
    swatches: ['#1d5a4e', '#c9a227', '#f7f1e3'],
    pattern: 'pattern-zellige',
  },
  {
    id: 'dunes',
    name: 'Desert Dunes',
    names: { fr: 'Dunes du Sahara', en: 'Desert Dunes', ar: 'كثبان الصحراء' },
    desc: {
      fr: 'Tons terracotta, sable et crème évoquant les dunes du Sahara.',
      en: 'Terracotta, sand and cream tones evoking the Sahara dunes.',
      ar: 'درجات التراكوتا والرمل والكريم توحي بكثبان الصحراء.',
    },
    swatches: ['#c46a3f', '#eadbc3', '#4a3325'],
    pattern: 'pattern-dunes',
  },
  {
    id: 'arabesque',
    name: 'Modern Arabesque',
    names: { fr: 'Arabesque Moderne', en: 'Modern Arabesque', ar: 'أرابيسك عصري' },
    desc: {
      fr: 'Ivoire, teal encre et laiton, étoiles à huit branches, style éditorial.',
      en: 'Ivory, ink teal and brass with eight-point stars, editorial style.',
      ar: 'عاجي وأخضر حبري ونحاسي بنجوم ثمانية، بأسلوب تحريري.',
    },
    swatches: ['#1f5d5c', '#a9842f', '#f6f2e8'],
    pattern: 'pattern-star',
  },
  {
    id: 'marrakech',
    name: 'Noir & Or',
    names: { fr: 'Nuit de Marrakech', en: 'Noir & Or', ar: 'ليلة مراكش' },
    desc: {
      fr: 'Base sombre charbon et or lumineux, ambiance des souks à la lanterne.',
      en: 'Dark charcoal base and luminous gold, lantern-lit souk atmosphere.',
      ar: 'قاعدة فحمية داكنة وذهبي متوهج، أجواء أسواق مراكش تحت الفوانيس.',
    },
    swatches: ['#2a3433', '#d9a941', '#f6f0df'],
    pattern: 'pattern-zellige',
  },
];

export function getTheme(id) {
  return themes.find((t) => t.id === id) || themes[0];
}
