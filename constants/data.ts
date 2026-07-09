/**
 * Trabzon ziyaretçi / kısa süreli konaklama odaklı içerik.
 * Görseller: stabil Unsplash URL’leri.
 */
export const DESTINATIONS = [
  {
    key: 'boztepe',
    title: 'Boztepe Volkan Konak Seyir Terası',
    subtitle: 'Ortahisar — şehir ve deniz kuşağı',
    image: require('../assets/places/boztepe-seyir.jpg'),
    tag: 'Manzara',
  },
  {
    key: 'ataturk-kosku',
    title: 'Atatürk Köşkü',
    subtitle: 'Ortahisar — çam ormanları içinde tarih',
    image: require('../assets/places/ataturk-kosku.jpg'),
    tag: 'Tarih',
  },

] as const;

/** Ana sayfa Hızlı Ulaşım — sadece özet */
export const TRANSPORT_QUICK = [
  { key: 'dolmus', label: 'Dolmuş', icon: 'car-outline' as const },
 ] as const;

/** Ulaşım sekmesi — tam liste */
export const TRANSPORT_ALL = [
  { key: 'dolmus', label: 'Dolmuş', icon: 'car-outline' as const },
  {
    key: 'havaalani',
    label: 'Havaalanı',
    icon: 'airplane-outline' as const,
  },
] as const;

/** Hızlı erişim — ziyaretçi için pratik bağlantılar */
export const GRID_ITEMS = [
  {
    key: 'duyuru',
    label: 'Duyurular',
    icon: 'megaphone-outline' as const,
    tint: '#1C5A99',
  },
  {
    key: 'sikayet',
    label: 'Şikayet / İstek',
    icon: 'chatbubbles-outline' as const,
    tint: '#D97706',
  },
  {
    key: 'belediye',
    label: 'Belediye',
    icon: 'business-outline' as const,
    tint: '#7C3AED',
  },
] as const;



/** Gezilecek yerler — keşif kategorileri */
export const PLACE_CATEGORIES = [
  {
    key: 'tarihi',
    label: 'Tarihi Yerler',
    icon: 'library-outline' as const,
    color: '#7C3AED',
  },
  {
    key: 'muze',
    label: 'Müzeler',
    icon: 'easel-outline' as const,
    color: '#6F4E37',
  },
  { 
    key: 'park', 
    label: 'Parklar', 
    icon: 'sunny-outline' as const, 
    color: '#0D9488' 
  },
  {
    key: 'manzara',
    label: 'Manzara Noktaları',
    icon: 'eye-outline' as const,
    color: '#D97706',
  },
] as const;
