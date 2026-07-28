
import { HISTORICAL_PLACES } from '../screens/HistoricalPlacesScreen';
import { PARKS } from '../screens/ParksScreen';
import { VIEWPOINTS } from '../screens/ViewpointsScreen';
import { MUSEUMS } from '../screens/MuseumsScreen';


export interface SearchItem {
  key: string;
  title: string;
  category: string;
  description: string;
  tags?: readonly string[] | string[];
  tab: 'Home' | 'Places';
  routeParams: {
    categoryKey?: string;
    detailKey?: string;

  };
}

export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

const TRANSPORT_ITEMS: SearchItem[] = [

  {
    key: 'havalimani',
    title: 'Havalimanı',
    category: 'Ulaşım',
    description: 'Trabzon Havalimanı ulaşım ve harita konum bilgileri.',
    tags: ['ulasim', 'havalimani', 'havalani', 'ucak', 'ucus'],
    tab: 'Home',
    routeParams: {},
  },
  {
    key: 'havas',
    title: 'Havaş Servisi',
    category: 'Ulaşım',
    description: 'Havalimanı ile şehir merkezi ve çevre iller arası servis bilgileri.',
    tags: ['ulasim', 'havas', 'servis', 'havalimani', 'havalani'],
    tab: 'Home',
    routeParams: {},
  },
];

export function getSearchItems(): SearchItem[] {
  const items: SearchItem[] = [...TRANSPORT_ITEMS];

  // Places -> Tarihi Yerler
  HISTORICAL_PLACES.forEach((p) => {
    items.push({
      key: p.key,
      title: p.title,
      category: 'Tarihi Yerler',
      description: p.description,
      tags: p.tags,
      tab: 'Places',
      routeParams: { categoryKey: 'tarihi', detailKey: p.key },
    });
  });

  // Places -> Parklar
  PARKS.forEach((p) => {
    items.push({
      key: p.key,
      title: p.title,
      category: 'Parklar',
      description: p.description,
      tags: p.tags,
      tab: 'Places',
      routeParams: { categoryKey: 'park', detailKey: p.key },
    });
  });


  // Places -> Manzara Noktaları
  VIEWPOINTS.forEach((p) => {
    items.push({
      key: p.key,
      title: p.title,
      category: 'Manzara Noktaları',
      description: p.description,
      tags: p.tags,
      tab: 'Places',
      routeParams: { categoryKey: 'manzara', detailKey: p.key },
    });
  });

  // Places -> Müzeler
  MUSEUMS.forEach((p) => {
    items.push({
      key: p.key,
      title: p.title,
      category: 'Müzeler',
      description: p.description,
      tags: p.tags,
      tab: 'Places',
      routeParams: { categoryKey: 'muze', detailKey: p.key },
    });
  });

  return items;
}

export function searchRegistry(query: string): SearchItem[] {
  if (!query || query.trim() === '') return [];
  const normalizedQuery = normalizeString(query);
  const items = getSearchItems();

  return items.filter((item) => {
    const matchTitle = normalizeString(item.title).includes(normalizedQuery);
    const matchDesc = normalizeString(item.description).includes(normalizedQuery);
    const matchTags = item.tags
      ? item.tags.some((tag) => normalizeString(tag).includes(normalizedQuery))
      : false;
    return matchTitle || matchDesc || matchTags;
  });
}
