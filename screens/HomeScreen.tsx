import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  UIManager,
  DeviceEventEmitter,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchField } from '../components/home/SearchField';
import type { RootTabParamList } from '../navigation/types';
import { cardShadow } from '../constants/layout';
import { colors, radius } from '../theme';
import { searchRegistry } from '../constants/searchRegistry';

import { loadLeaflet, injectMarkerStyles } from '../components/leafletLoader';

const CARD_WIDTH = 270;
const CARD_GAP = 12;

export const CATEGORY_STYLES = {
  tarihi: { color: '#7C3AED', icon: 'library' }, // Mor Tarihi İşaretçi
  park: { color: '#0D9488', icon: 'leaf' }, // Turkuaz Yapraklı İşaretçi
  manzara: { color: '#D97706', icon: 'eye' }, // Turuncu Göz/Dürbün İşaretçi
  dolmus: { color: '#3B82F6', icon: 'car' }, // Mavi Dolmuş Durağı İşaretçisi
  muze: { color: '#6F4E37', icon: 'easel' }, // Kahverengi Müze İşaretçisi
} as const;

export const SVG_ICONS = {
  flower: `<circle cx="256" cy="112" r="100"/><circle cx="393" cy="212" r="100"/><circle cx="341" cy="373" r="100"/><circle cx="171" cy="373" r="100"/><circle cx="119" cy="212" r="100"/><circle cx="256" cy="256" r="120"/>`,
  library: `<path d="M256 32L32 128v32h448v-32L256 32zM80 192v208h48V192H80zm112 0v208h48V192h-48zm112 0v208h48V192h-48zm112 0v208h48V192h-48zM48 432v48h416v-48H48z"/>`,
  leaf: `<path d="M160 48v224c0 70.6 57.4 128 128 128h16V304c0-70.6-57.4-128-128-128H160z"/>`,
  eye: `<path d="M256 96C128 96 32 192 32 256s96 160 224 160 224-96 224-160-96-160-224-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm0-160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/>`,
  car: `<path d="M400 192H112a32 32 0 00-32 32v144a32 32 0 0032 32h16a32 32 0 0032-32v-16h208v16a32 32 0 0032 32h16a32 32 0 0032-32V224a32 32 0 00-32-32zm-256 128a24 24 0 1124-24 24 24 0 01-24 24zm192 0a24 24 0 1124-24 24 24 0 01-24 24z"/>`,
  easel: `<path d="M448 32H64C46.3 32 32 46.3 32 64v256c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm-32 256H96V96h320v192zM160 384l-32 96h32l24-72h144l24 72h32l-32-96H160z"/>`,
  building: `<path d="M256 16L32 112v32h448v-32L256 16zm-144 160v208h48V176h-48zm96 0v208h48V176h-48zm96 0v208h48V176h-48zm96 0v208h48V176h-48zM16 432v48h480v-48H16z"/>`,
  heart: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`,
} as const;

interface MapPoint {
  key: string;
  title: string;
  category: string;
  categoryKey: 'tarihi' | 'park' | 'manzara' | 'dolmus' | 'muze';
  detailKey: string;
  image: any;
  phone?: string;
  tags: string[];
  lat: number;
  lng: number;
}

export const MAP_POINTS: MapPoint[] = [
  // --- MANZARA ---

  {
    key: 'boztepe',
    title: 'Boztepe Volkan Konak Seyir Terası',
    category: 'Manzara',
    categoryKey: 'manzara',
    detailKey: 'boztepe',
    image: require('../assets/places/boztepe-seyir.jpg'),
    tags: ['Manzara', 'Seyir', 'Tepe'],
    lat: 40.998642320657154,
    lng: 39.73193707325702,
  },
  {
    key: 'besirli-sahil',
    title: 'Beşirli Sahil',
    category: 'Manzara',
    categoryKey: 'manzara',
    detailKey: 'besirli-sahil',
    image: require('../assets/places/besirli-sahil.jpg'),
    tags: ['Sahil', 'Manzara', 'Yürüyüş'],
    lat: 40.99807847225093,
    lng: 39.66496209498218,
  },

  // --- PARKLAR ---


  {
    key: 'besirli-ekopark',
    title: 'Beşirli EkoPark',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'besirli-ekopark',
    image: require('../assets/places/ekopark.jpg'),
    tags: ['Sahil', 'Park', 'Yürüyüş'],
    lat: 40.99733136360183,
    lng: 39.67507512642866,
  },



  {
    key: 'tunel-akvaryum',
    title: 'Trabzon Tünel Akvaryum',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'tunel-akvaryum',
    image: require('../assets/places/akvaryum.jpg'),
    tags: ['Akvaryum', 'Tünel', 'Turistik'],
    lat: 41.000817164722186,
    lng: 39.72075816878773,
  },
  {
    key: 'en-mutlu-koy',
    title: 'En Mutlu Köy',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'en-mutlu-koy',
    image: require('../assets/places/en-mutlu.jpg'),
    tags: ['Yaşam Alanı', 'Sera', 'Doğa', 'Geçit'],
    lat: 40.91514140604246,
    lng: 39.66337956383388,
  },
  {
    key: 'saglikcilar-parki',
    title: 'Sağlıkçılar Parkı',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'saglikcilar-parki',
    image: require('../assets/places/saglikcilar.jpg'),
    tags: ['Park', 'Yeşil Alan', 'Erdoğdu'],
    lat: 40.991890755934165,
    lng: 39.70669495894049,
  },
  {
    key: 'engelsiz-yasam-merkezi',
    title: 'Engelsiz Yaşam Merkezi',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'engelsiz-yasam-merkezi',
    image: require('../assets/places/engelsiz.jpg'),
    tags: ['Park', 'Engelsiz Yaşam', 'Sosyal'],
    lat: 41.00424958922368,
    lng: 39.727670274476786,
  },

  // --- TARİHİ YERLER ---

  {
    key: 'ayasofya',
    title: 'Trabzon Ayasofya Camii',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'ayasofya',
    image: require('../assets/places/ayasofya.jpg'),
    tags: ['Tarih', 'Mimari', 'Kültür'],
    lat: 41.003376809970014,
    lng: 39.6963131326272,
  },
  {
    key: 'ataturk-kosku',
    title: 'Atatürk Köşkü',
    category: 'Müzeler',
    categoryKey: 'muze',
    detailKey: 'ataturk-kosku',
    image: require('../assets/places/ataturk-kosku.jpg'),
    tags: ['Müze', 'Tarih', 'Köşk'],
    lat: 40.9800986756486,
    lng: 39.69743770873954,
  },






  {
    key: 'hasan-pasa-hamami',
    title: 'Hasan Paşa Asker Hamamı Müzesi',
    category: 'Müzeler',
    categoryKey: 'muze',
    detailKey: 'hasan-pasa-hamami',
    image: require('../assets/places/askerihamam.jpg'),
    tags: ['Müze', 'Tarih', 'Hamam Kültürü'],
    lat: 41.003149686480064,
    lng: 39.709364356079625,
  },
  {
    key: 'trabzon-tarih-muzesi',
    title: 'Trabzon Tarih Müzesi',
    category: 'Müzeler',
    categoryKey: 'muze',
    detailKey: 'trabzon-tarih-muzesi',
    image: require('../assets/places/trabzon-tarih.jpg'),
    tags: ['Müze', 'Tarih', 'Ortahisar'],
    lat: 41.00508984944358,
    lng: 39.72117570210007,
  },
  {
    key: 'basin-tarihi-muzesi',
    title: 'Basın Tarihi Müzesi',
    category: 'Müzeler',
    categoryKey: 'muze',
    detailKey: 'basin-tarihi-muzesi',
    image: require('../assets/places/basın-tarihi.jpg'),
    tags: ['Müze', 'Basın', 'Tarih'],
    lat: 41.00508984944358,
    lng: 39.72117570210007,
  },


  // --- MANZARA NOKTALARI ---


  // ---BELEDİYE BİNASI---
  {
    key: 'ortahisar-belediyesi',
    title: 'Ortahisar Belediyesi',
    category: 'İdari Merkez',
    categoryKey: 'tarihi',
    detailKey: '', // Detay sayfası olmadığı için boş bırakıyoruz, harita kodunda çökme yapmaz
    image: require('../assets/places/ortahisar.jpg'),
    tags: ['Belediye', 'Yönetim', 'Merkez'],
    lat: 41.006969630295956,
    lng: 39.71941385810829
  },




];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const lastNavTriggerRef = React.useRef<number>(0);

  const handleDynamicRoute = async (targetLat: number, targetLng: number) => {
    const now = Date.now();
    if (now - lastNavTriggerRef.current < 1500) {
      console.log('[HomeScreen] Duplicate navigation trigger ignored');
      return;
    }
    lastNavTriggerRef.current = now;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Uyarı',
          'Konum izni verilmediği için mevcut konumdan rota çizilemiyor. Hedef nokta haritada açılacak.',
          [{ text: 'Tamam' }]
        );
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${targetLat},${targetLng}`);
    } catch (e) {
      console.warn(e);
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`);
    }
  };

  const DEFAULT_PLACE_CATEGORIES = ['tarihi', 'park', 'manzara', 'muze'];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedKey, setSelectedKey] = React.useState<string>('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(DEFAULT_PLACE_CATEGORIES);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showMyLocation, setShowMyLocation] = React.useState(false);
  const [userCoords, setUserCoords] = React.useState<{ latitude: number, longitude: number } | null>(null);
  const showMyLocationRef = React.useRef(false);
  const userCoordsRef = React.useRef<{ latitude: number, longitude: number } | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);

  const toggleCategory = (catKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(catKey) ? prev.filter(c => c !== catKey) : [...prev, catKey]
    );
    setSelectedKey(''); // Seçim değiştiğinde aktif pin odağını sıfırla
  };

  const resetMapView = () => {
    if (Platform.OS === 'web') {
      if (mapRef.current) {
        mapRef.current.setView([40.998, 39.715], 13, { animate: true });
      }
    } else {
      mapRef.current?.injectJavaScript(`
        if (window.map) {
          window.map.setView([40.998, 39.715], 13, { animate: true });
        }
        true;
      `);
    }
  };

  const resetMapViewToHome = () => {
    setSelectedKey('');
    if (Platform.OS === 'web') {
      if (mapRef.current) {
        mapRef.current.closePopup();
        mapRef.current.setView([40.997500, 39.712500], 13, { animate: true });
      }
    } else {
      mapRef.current?.injectJavaScript(`
        if (window.map) {
          window.map.closePopup();
        }
        if (window.selectPin) {
          window.selectPin('');
        }
        if (window.map) {
          window.map.setView([40.997500, 39.712500], 13, { animate: true });
        }
        true;
      `);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetMapViewToHome();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('tabPress_Home', () => {
      if (selectedKey || searchQuery !== '') {
        setSelectedKey('');
        setSelectedCategories(DEFAULT_PLACE_CATEGORIES);
        setSearchQuery('');
        resetMapView();
      } else {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        resetMapView();
      }
    });
    return () => sub.remove();
  }, [selectedKey, selectedCategories, searchQuery]);

  const CAROUSEL_POINTS = React.useMemo(() => {
    return MAP_POINTS.filter((p) => p.detailKey !== '' && selectedCategories.includes(p.categoryKey));
  }, [selectedCategories]);

  const flatListRef = React.useRef<FlatList<MapPoint>>(null);
  const mapRef = React.useRef<any>(null);
  const markersRef = React.useRef<Record<string, any>>({});
  const userMarkerRef = React.useRef<any>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const filteredResults = React.useMemo(() => {
    return searchRegistry(searchQuery);
  }, [searchQuery]);

  const filteredPoints = React.useMemo(() => {
    return MAP_POINTS.filter((point) => {
      return selectedCategories.includes(point.categoryKey);
    });
  }, [selectedCategories]);

  const pointsData = React.useMemo(() => {
    return filteredPoints.map((point) => {
      const style = CATEGORY_STYLES[point.categoryKey];
      let pointColor: string = style ? style.color : '#3B82F6';

      let imageUrl: string | undefined = undefined;
      if (point.image) {
        try {
          if (typeof point.image === 'string') {
            imageUrl = point.image;
          } else if (typeof point.image === 'object' && point.image !== null && typeof (point.image as any).default === 'string') {
            imageUrl = (point.image as any).default;
          } else if (typeof point.image === 'object' && point.image !== null && typeof (point.image as any).uri === 'string') {
            imageUrl = (point.image as any).uri;
          } else {
            const resolved = Image.resolveAssetSource(point.image);
            imageUrl = resolved?.uri;
          }
        } catch (e) {
          imageUrl = undefined;
        }
      }

      return {
        key: point.key,
        title: point.title,
        lat: point.lat,
        lng: point.lng,
        color: pointColor,
        svgIcon: SVG_ICONS[style.icon],
        categoryKey: point.categoryKey,
        detailKey: point.detailKey,
        imageUrl: imageUrl,
      };
    });
  }, [filteredPoints]);

  // Synchronize user location marker on the Leaflet map
  const syncUserLocation = React.useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const L = (window as any).L;
    if (!L) return;

    if (showMyLocation && userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.latitude, userCoords.longitude]);
      } else {
        const html = '<div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));"><svg viewBox="0 0 32 32" style="width: 26px; height: 26px; fill: #FF0000;"><path d="M16 28.5S2 16.5 2 9.5a7.5 7.5 0 0 1 12.8-5.3L16 5.5l1.2-1.3a7.5 7.5 0 0 1 12.8 5.3c0 7-14 19-14 19z"/></svg></div>';
        const icon = L.divIcon({ html: html, className: '', iconSize: [30, 30], iconAnchor: [15, 27] });
        userMarkerRef.current = L.marker([userCoords.latitude, userCoords.longitude], { icon: icon, zIndexOffset: 1000 }).addTo(map);
      }
      map.setView([userCoords.latitude, userCoords.longitude], 15, { animate: true });
    } else {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    }
  }, [showMyLocation, userCoords]);

  // Rebuild and synchronize all markers on the Leaflet map
  const syncMarkers = React.useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: any) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    pointsData.forEach((point) => {
      const isSelected = point.key === selectedKey;

      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.style.padding = '6px';
      popupContent.style.textAlign = 'center';
      popupContent.style.minWidth = '180px';
      popupContent.style.maxWidth = '210px';

      const titleEl = document.createElement('b');
      titleEl.style.fontSize = '14px';
      titleEl.style.color = '#1F2937';
      titleEl.style.display = 'block';
      titleEl.style.marginBottom = '8px';
      titleEl.textContent = point.title;
      popupContent.appendChild(titleEl);

      if (point.imageUrl) {
        const imgEl = document.createElement('img');
        imgEl.src = point.imageUrl;
        imgEl.alt = point.title;
        imgEl.style.width = '100%';
        imgEl.style.height = '130px';
        imgEl.style.objectFit = 'cover';
        imgEl.style.borderRadius = '8px';
        imgEl.style.marginBottom = '10px';
        imgEl.style.display = 'block';
        popupContent.appendChild(imgEl);
      }

      const btnEl = document.createElement('button');
      btnEl.style.backgroundColor = '#3B82F6';
      btnEl.style.color = 'white';
      btnEl.style.border = 'none';
      btnEl.style.padding = '8px 12px';
      btnEl.style.fontSize = '12px';
      btnEl.style.fontWeight = 'bold';
      btnEl.style.borderRadius = '6px';
      btnEl.style.cursor = 'pointer';
      btnEl.style.width = '100%';
      btnEl.style.display = 'block';
      btnEl.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      btnEl.textContent = 'Yol Tarifi Al';
      btnEl.onclick = (e) => {
        e.preventDefault();
        handleDynamicRoute(point.lat, point.lng);
      };
      popupContent.appendChild(btnEl);

      let currentIconColor = point.color;
      let viewBox = '0 0 512 512';
      let currentIconSvg: string = point.svgIcon;

      if (point.key === 'ortahisar-belediyesi') {
        currentIconColor = '#FF0000';
        currentIconSvg = SVG_ICONS['heart'];
        viewBox = '0 0 24 24';
      }

      const currentIconHtml = `<svg style="width: 16px; height: 16px; fill: white;" viewBox="${viewBox}">${currentIconSvg}</svg>`;

      const markerHtml = `
        <div class="custom-marker" id="marker-${point.key}">
          <div class="pulse-circle" style="border-color: ${currentIconColor}; display: ${isSelected ? 'block' : 'none'};"></div>
          <div class="marker-bubble" style="background-color: ${currentIconColor}; width: ${isSelected ? '34px' : '28px'}; height: ${isSelected ? '34px' : '28px'}; border-radius: ${isSelected ? '17px' : '14px'};">
            ${currentIconHtml}
          </div>
          <div class="marker-arrow" style="background-color: ${currentIconColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [30, 35],
        iconAnchor: [15, 35]
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -10] });

      marker.on('click', () => {
        if (point.detailKey !== '' || point.key === 'ortahisar-belediyesi') {
          setSelectedKey(point.key);
          const index = CAROUSEL_POINTS.findIndex((p) => p.key === point.key);
          if (index !== -1) {
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
          }
        }
      });

      markersRef.current[point.key] = marker;
    });

    syncUserLocation();

    // Focus selected pin if available
    if (selectedKey && markersRef.current[selectedKey]) {
      const selectedMarker = markersRef.current[selectedKey];
      map.setView(selectedMarker.getLatLng(), 15, { animate: true });
      selectedMarker.openPopup();
    }
  }, [pointsData, selectedKey, syncUserLocation, CAROUSEL_POINTS]);

  // Maintain syncMarkers ref to avoid breaking initializeMap dependency chain
  const syncMarkersRef = React.useRef(syncMarkers);
  React.useEffect(() => {
    syncMarkersRef.current = syncMarkers;
  });

  // Initialize standard Leaflet Map on DOM container mount
  const initializeMap = React.useCallback((container: HTMLDivElement) => {
    loadLeaflet().then(() => {
      injectMarkerStyles();
      const L = (window as any).L;
      if (!L) return;

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(container, {
        zoomControl: false,
        minZoom: 4,
        maxZoom: 18,
      }).setView([40.997500, 39.712500], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      map.on('click', (e: any) => {
        const target = e.originalEvent.target;
        if (target === container || target.classList.contains('leaflet-container')) {
          setSelectedKey('');
        }
      });

      mapRef.current = map;
      syncMarkersRef.current();
    }).catch((err) => {
      console.error('Failed to load Leaflet map:', err);
    });
  }, []);

  const destroyMap = React.useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    markersRef.current = {};
    userMarkerRef.current = null;
  }, []);

  const mapContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      initializeMap(node);
    } else {
      destroyMap();
    }
  }, [initializeMap, destroyMap]);

  // Re-sync markers when pointsData updates
  React.useEffect(() => {
    if (mapRef.current) {
      syncMarkers();
    }
  }, [pointsData, syncMarkers]);

  // Sync selected pin visual updates and focus
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.keys(markersRef.current).forEach((key) => {
      const el = document.getElementById(`marker-${key}`);
      if (el) {
        const pulse = el.querySelector('.pulse-circle') as HTMLElement;
        const bubble = el.querySelector('.marker-bubble') as HTMLElement;
        const isSelected = key === selectedKey;
        if (pulse) pulse.style.display = isSelected ? 'block' : 'none';
        if (bubble) {
          bubble.style.width = isSelected ? '34px' : '28px';
          bubble.style.height = isSelected ? '34px' : '28px';
          bubble.style.borderRadius = isSelected ? '17px' : '14px';
        }
      }
    });

    if (selectedKey && markersRef.current[selectedKey]) {
      const selectedMarker = markersRef.current[selectedKey];
      map.setView(selectedMarker.getLatLng(), 15, { animate: true });
      selectedMarker.openPopup();
    } else {
      map.closePopup();
    }
  }, [selectedKey]);

  // Re-sync user location marker
  React.useEffect(() => {
    if (mapRef.current) {
      syncUserLocation();
    }
  }, [syncUserLocation]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleRequestLocation = async () => {
    if (userCoords) {
      setUserCoords(null);
      userCoordsRef.current = null;
      setShowMyLocation(false);
      showMyLocationRef.current = false;
      return;
    }

    if (isLocating) return;
    try {
      setIsLocating(true);

      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          alert("Tarayıcınız konum özelliğini desteklemiyor veya güvenli bağlantı (HTTPS/localhost) kullanılmıyor.");
          setIsLocating(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserCoords({ latitude: lat, longitude: lng });
            userCoordsRef.current = { latitude: lat, longitude: lng };
            setShowMyLocation(true);
            showMyLocationRef.current = true;
            setIsLocating(false);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            let errorMsg = "Konum alınamadı.";
            if (error.code === error.PERMISSION_DENIED) {
              errorMsg = "Konum izni reddedildi. Lütfen tarayıcınızın adres çubuğundaki kilit simgesine tıklayarak konum iznini 'İzin Ver' olarak değiştirin.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMsg = "Konum bilgisi şu anda kullanılamıyor (Cihazınızın GPS'inin açık olduğundan emin olun).";
            } else if (error.code === error.TIMEOUT) {
              errorMsg = "Konum isteği zaman aşımına uğradı.";
            }
            alert(errorMsg);
            setIsLocating(false);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Konumunuzu haritada gösterebilmek için konum izni vermeniz gerekmektedir.'
        );
        setIsLocating(false);
        return;
      }

      let loc = await Location.getLastKnownPositionAsync();
      if (!loc) {
        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      }

      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      setUserCoords({ latitude: lat, longitude: lng });
      userCoordsRef.current = { latitude: lat, longitude: lng };
      setShowMyLocation(true);
      showMyLocationRef.current = true;
    } catch (error) {
      console.warn('Konum hatası:', error);
      Alert.alert('Hata', "Konum alınamadı.");
    } finally {
      setIsLocating(false);
    }
  };

  const onMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_GAP));
    if (index >= 0 && index < CAROUSEL_POINTS.length) {
      setSelectedKey(CAROUSEL_POINTS[index].key);
    }
  };

  const renderCarouselItem = ({ item }: { item: MapPoint }) => {
    const isSelected = selectedKey === item.key;
    const style = CATEGORY_STYLES[item.categoryKey];
    return (
      <Pressable
        onPress={() => {
          setSelectedKey(item.key);
          const index = CAROUSEL_POINTS.findIndex((p) => p.key === item.key);
          if (index !== -1) {
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
          }
        }}
        style={({ pressed }) => [
          styles.carouselCard,
          isSelected && { borderColor: style.color, borderWidth: 2.5 },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          cardShadow,
        ]}
      >
        <View style={styles.cardImageContainer}>
          <ImageBackground
            source={item.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardContentContainer}>
          <View style={[styles.cardTagWrap, { backgroundColor: style.color }]}>
            <Text style={styles.cardTagText}>{item.category}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.cardDetailRow}>
            <Text style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic', flexWrap: 'wrap' }}>
              Detaylar için gezilecek yerler sayfasına bakınız.
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleQuickAccess = async (key: string) => {
    if (key === 'duyuru') {
      const url = 'https://www.trabzonortahisar.bel.tr/duyurular';
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {searchQuery.trim().length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.searchHeaderRow}>
              <View style={styles.searchFieldWrapper}>
                <SearchField
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  style={{ marginBottom: 0 }}
                />
              </View>
            </View>
          </View>
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={[styles.searchResultsContainer, cardShadow]}>
              {filteredResults.length > 0 ? (
                <View style={styles.resultsList}>
                  {filteredResults.map((item, idx) => (
                    <View key={`${item.tab}-${item.key}`}>
                      {idx > 0 && <View style={styles.resultDivider} />}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${item.title}, Kategori: ${item.category}`}
                        onPress={() => {
                          setSearchQuery('');
                          navigation.navigate(item.tab as any, item.routeParams as any);
                        }}
                        style={({ pressed }) => [
                          styles.resultCard,
                          pressed && styles.resultCardPressed,
                        ]}
                      >
                        <View style={styles.resultHeader}>
                          <Text style={styles.resultTitle}>{item.title}</Text>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>
                              {item.category}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.resultDesc} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noResultsCard}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={colors.textMuted}
                  />
                  <Text style={styles.noResultsText}>Sonuç bulunamadı</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingHorizontal: 28,
            paddingBottom: tabBarHeight + 5,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <View style={styles.searchHeaderRow}>
                <View style={styles.searchFieldWrapper}>
                  <SearchField
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    style={{ marginBottom: 0 }}
                  />
                </View>
                {searchQuery.trim().length === 0 && (
                  <View style={[
                    styles.socialMediaRow,
                    {
                      borderColor: selectedKey === 'ortahisar-belediyesi' ? '#EF4444' : 'transparent',
                      borderWidth: selectedKey === 'ortahisar-belediyesi' ? 1.5 : 0,
                      borderRadius: 8,
                      padding: selectedKey === 'ortahisar-belediyesi' ? 4 : 0,
                    }
                  ]}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ortahisar Belediyesi Facebook Sayfası"
                      onPress={() => Linking.openURL('https://www.facebook.com/trbortahisarbel?mibextid=ZbWKwL')}
                      style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
                    >
                      <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ortahisar Belediyesi X Hesabı"
                      onPress={() => Linking.openURL('https://x.com/trbortahisarbel')}
                      style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
                    >
                      <Ionicons name="logo-x" size={18} color="#000000" />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ortahisar Belediyesi Instagram Hesabı"
                      onPress={() => Linking.openURL('https://www.instagram.com/trortahisarbel/')}
                      style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
                    >
                      <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ortahisar Belediyesi YouTube Kanalı"
                      onPress={() => Linking.openURL('https://www.youtube.com/channel/UCspHo01bOgAIRfS8HXPwSLg?reload=9')}
                      style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
                    >
                      <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                    </Pressable>
                  </View>
                )}
              </View>

              {searchQuery.trim().length === 0 && (
                <View style={styles.topButtonsRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Duyurular"
                    onPress={() => handleQuickAccess('duyuru')}
                    style={({ pressed }) => [
                      styles.topBadgeBtn,
                      pressed && { opacity: 0.85 },
                      {
                        borderColor: selectedKey === 'ortahisar-belediyesi' ? '#EF4444' : colors.border,
                        borderWidth: selectedKey === 'ortahisar-belediyesi' ? 2 : 1,
                      }
                    ]}
                  >
                    <Ionicons
                      name="megaphone-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.topBadgeBtnText}>Duyurular</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Haberler"
                    onPress={() => Linking.openURL('https://www.trabzonortahisar.bel.tr/haberler')}
                    style={({ pressed }) => [
                      styles.topBadgeBtn,
                      pressed && { opacity: 0.85 },
                      {
                        borderColor: selectedKey === 'ortahisar-belediyesi' ? '#EF4444' : colors.border,
                        borderWidth: selectedKey === 'ortahisar-belediyesi' ? 2 : 1,
                      }
                    ]}
                  >
                    <Ionicons
                      name="newspaper-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.topBadgeBtnText}>Haberler</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Web Sitemiz"
                    onPress={() => Linking.openURL('https://www.trabzonortahisar.bel.tr/')}
                    style={({ pressed }) => [
                      styles.topBadgeBtn,
                      pressed && { opacity: 0.85 },
                      {
                        borderColor: selectedKey === 'ortahisar-belediyesi' ? '#EF4444' : colors.border,
                        borderWidth: selectedKey === 'ortahisar-belediyesi' ? 2 : 1,
                      }
                    ]}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.topBadgeBtnText}>Web Sitemiz</Text>
                  </Pressable>
                </View>
              )}
            </View>
            <View style={[styles.mapWrapper, cardShadow]}>
              {Platform.OS === 'web' ? (
                <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }} />
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Konumumu Göster"
                onPress={handleRequestLocation}
                style={({ pressed }) => [
                  styles.locationBtn,
                  cardShadow,
                  pressed && { opacity: 0.8 },
                ]}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Ionicons name={showMyLocation ? "locate" : "locate-outline"} size={20} color={showMyLocation ? colors.primary : "#374151"} />
                )}
              </Pressable>

              <View style={styles.zoomControls}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Yakınlaştır"
                  onPress={handleZoomIn}
                  style={({ pressed }) => [
                    styles.zoomBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="add" size={18} color="#374151" />
                </Pressable>
                <View style={styles.zoomDivider} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Uzaklaştır"
                  onPress={handleZoomOut}
                  style={({ pressed }) => [
                    styles.zoomBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="remove" size={18} color="#374151" />
                </Pressable>
              </View>
            </View>


            <View style={[styles.carouselWrapper, { marginBottom: 16 }]}>
              <FlatList
                ref={flatListRef}
                data={CAROUSEL_POINTS}
                renderItem={renderCarouselItem}
                keyExtractor={(item) => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                decelerationRate="fast"
                onMomentumScrollEnd={onMomentumScrollEnd}
                getItemLayout={(data, index) => ({
                  length: CARD_WIDTH + CARD_GAP,
                  offset: (CARD_WIDTH + CARD_GAP) * index,
                  index,
                })}
              />
            </View>

            <View style={[styles.legendContainer, { flexDirection: 'column', alignItems: 'stretch', paddingVertical: 10, marginTop: 12 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tarihi Yerler Filtresi"
                  onPress={() => toggleCategory('tarihi')}
                  style={[
                    styles.legendItem,
                    { opacity: selectedCategories.includes('tarihi') ? 1.0 : 0.4 }
                  ]}
                >
                  <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.tarihi.color }]}>
                    <Ionicons name={CATEGORY_STYLES.tarihi.icon as any} size={8.5} color="#FFF" />
                  </View>
                  <Text style={styles.legendText}>Tarih</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Parklar Filtresi"
                  onPress={() => toggleCategory('park')}
                  style={[
                    styles.legendItem,
                    { opacity: selectedCategories.includes('park') ? 1.0 : 0.4 }
                  ]}
                >
                  <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.park.color }]}>
                    <Ionicons name={CATEGORY_STYLES.park.icon as any} size={8.5} color="#FFF" />
                  </View>
                  <Text style={styles.legendText}>Park</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Manzara Noktaları Filtresi"
                  onPress={() => toggleCategory('manzara')}
                  style={[
                    styles.legendItem,
                    { opacity: selectedCategories.includes('manzara') ? 1.0 : 0.4 }
                  ]}
                >
                  <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.manzara.color }]}>
                    <Ionicons name={CATEGORY_STYLES.manzara.icon as any} size={8.5} color="#FFF" />
                  </View>
                  <Text style={styles.legendText}>Manzara</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Müzeler Filtresi"
                  onPress={() => toggleCategory('muze')}
                  style={[
                    styles.legendItem,
                    { opacity: selectedCategories.includes('muze') ? 1.0 : 0.4 }
                  ]}
                >
                  <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.muze.color }]}>
                    <Ionicons name={CATEGORY_STYLES.muze.icon as any} size={8.5} color="#FFF" />
                  </View>
                  <Text style={styles.legendText}>Müze</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Image
            source={require('../assets/ortahisar_motto.png')}
            style={styles.mottoImage}
            resizeMode="contain"
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 0,
    paddingTop: 12,
    backgroundColor: '#F3F4F6',
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  searchFieldWrapper: {
    width: '70%',
  },
  topButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 0,
  },
  topBadgeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.secondarySoft,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 95,
  },
  topBadgeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  socialMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 0,
  },
  socialIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mapWrapper: {
    height: 540,
    minHeight: 540,
    backgroundColor: '#E5E7EB',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 0,
  },
  webviewStyle: {
    flex: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
  },
  locationBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
  },
  zoomBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  carouselWrapper: {
    marginTop: 4,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  carouselContainer: {
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 170,
    borderRadius: radius.lg,
    marginRight: CARD_GAP,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  carouselCardSelected: {
    borderWidth: 2.5,
  },
  cardImageContainer: {
    width: '100%',
    height: '55%',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageRadius: {
    borderRadius: radius.md,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    borderRadius: radius.md,
  },
  cardContentContainer: {
    width: '100%',
    height: '45%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 10,
  },
  cardTagWrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDetailLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 28,
    flex: 1,
  },
  searchResultsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
    overflow: 'hidden',
    padding: 8,
  },
  resultsList: {
    flexDirection: 'column',
  },
  resultCard: {
    padding: 12,
    borderRadius: radius.md,
  },
  resultCardPressed: {
    backgroundColor: colors.searchBg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  resultDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  resultDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  noResultsCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: radius.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#0369A1',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    marginHorizontal: 20,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  extraLayersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginTop: 4,
    marginBottom: 6,
  },
  extraLayersHeaderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4B5563',
  },
  stopChipsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
    height: 32,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    height: 28,
  },
  stopChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  stopChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  stopChipTextSelected: {
    color: '#FFFFFF',
  },
  dolmusLegend: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dolmusLegendText: {
    fontSize: 12,
    color: '#4B5563',
  },
  subTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  subTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  subTabActive: {
    backgroundColor: '#3B82F6',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  mottoImage: {
    alignSelf: 'center',
    width: 120,
    height: 60,
    marginTop: 'auto',
    marginBottom: 0,
    opacity: 0.6,
    tintColor: '#6B7280',
  },
  dolmusSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    height: 36,
  },
  dolmusSearchIcon: {
    marginRight: 6,
  },
  dolmusSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A',
    paddingVertical: 0,
  },
  dolmusSearchClear: {
    padding: 4,
  },
});
