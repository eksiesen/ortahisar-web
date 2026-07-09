import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadLeaflet, injectMarkerStyles } from '../components/leafletLoader';
import { TRANSPORT_ALL } from '../constants/data';
import { cardShadow } from '../constants/layout';
import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';

const BLURBS: Record<string, string> = {
  dolmus: 'Kısa mesafe ve merkez çevresi için hızlı paylaşımlı ulaşım.',
  havaalani: 'Trabzon Havalimanı ulaşım bilgileri',
};

type TransportDetailKey =
  | 'dolmus'
  | 'havalimani'
  | 'havas'
  | null;

const POPULAR_STOPS = [
  { key: 'meydan-boztepe', title: 'Meydan - Boztepe', blurb: 'Merkez / Seyir hattı' },
  { key: 'meydan-kosk', title: 'Meydan - Atatürk Köşkü', blurb: 'Tarih hattı' },
  { key: 'meydan-besirli', title: 'Meydan - Beşirli (Ganita)', blurb: 'Sahil hattı' },
  { key: 'moloz-akcaabat', title: 'Moloz - Akçaabat', blurb: 'Komşu İlçe hattı' },
  { key: 'tanjant-ktu', title: 'Tanjant - KTÜ', blurb: 'Üniversite hattı' },
  {
    key: 'tanjant-havalimani',
    title: 'Tanjant - Havalimanı',
    blurb: 'Havalimanı hattı',
  },
] as const;



const DOLMUS_STOPS = [
  // Postane stops
  { key: 'p-aydinlikevler', title: 'Postane - Aydınlıkevler', category: 'Postane', lat: 41.00694023127856, lng: 39.72396549223134 },
  { key: 'p-besirli', title: 'Postane - Beşirli', category: 'Postane', lat: 41.00703738683742, lng: 39.72422298429274 },
  { key: 'p-camlik', title: 'Postane - Çamlık', category: 'Postane', lat: 41.00630096403004, lng: 39.72431295917866 },
  { key: 'p-kurucesme', title: 'Postane - Kuruçeşme', category: 'Postane', lat: 41.00638192779012, lng: 39.72450607823613 },
  { key: 'p-karsiyaka', title: 'Postane - Karşıyaka', category: 'Postane', lat: 41.006479084173115, lng: 39.72474211262841 },
  { key: 'p-yesiltepe', title: 'Postane - Yeşiltepe', category: 'Postane', lat: 41.00648509643725, lng: 39.72499612478102 },
  { key: 'p-yenimahalle', title: 'Postane - Yenimahalle', category: 'Postane', lat: 41.00653367456364, lng: 39.72505506711441 },
  { key: 'p-bahcecik', title: 'Postane - Bahçecik', category: 'Postane', lat: 41.00658225267422, lng: 39.725237397800925 },
  { key: 'p-catak', title: 'Postane - Çatak', category: 'Postane', lat: 41.00630697629395, lng: 39.724716648074455 },
  { key: 'p-erdogdu', title: 'Postane - Erdoğdu Camiyanı', category: 'Postane', lat: 41.0063069763029, lng: 39.724939924776585 },
  { key: 'p-kurankursu', title: 'Postane - Kurankursu', category: 'Postane', lat: 41.00638794006531, lng: 39.725030994112934 },

  // Tanjant stops
  { key: 't-yenicuma', title: 'Tanjant - Yenicuma', category: 'Tanjant', lat: 41.00390886029602, lng: 39.731202000733916 },
  { key: 't-boztepe', title: 'Tanjant - Boztepe', category: 'Tanjant', lat: 41.003733139772066, lng: 39.73111617004029 },
  { key: 't-yesiltepe', title: 'Tanjant - Yeşiltepe', category: 'Tanjant', lat: 41.003947345862244, lng: 39.731609696495966 },
  { key: 't-kurankursu', title: 'Tanjant - Kurankursu', category: 'Tanjant', lat: 41.00393115252039, lng: 39.73173844254546 },
  { key: 't-degirmendere', title: 'Tanjant - Değirmendere', category: 'Tanjant', lat: 41.00383399235108, lng: 39.731738442532716 },
  { key: 't-yenimahalle', title: 'Tanjant - Yenimahalle', category: 'Tanjant', lat: 41.00368825190336, lng: 39.73171698487232 },
  { key: 't-caglayan', title: 'Tanjant - Çağlayan', category: 'Tanjant', lat: 41.00347773733897, lng: 39.73165261183078 },
  { key: 't-ktu', title: 'Tanjant - KTÜ', category: 'Tanjant', lat: 41.00306344155076, lng: 39.731845730892836 },
  { key: 't-havalimani', title: 'Tanjant - Havalimanı', category: 'Tanjant', lat: 41.00288942074333, lng: 39.731953019271145 },
  { key: 't-tip', title: 'Tanjant - Tıp Fakültesi', category: 'Tanjant', lat: 41.003004243455905, lng: 39.732024388536715 },
  { key: 't-aydinlikevler', title: 'Tanjant - Aydınlıkevler', category: 'Tanjant', lat: 41.003902335468496, lng: 39.73167406626473 },

  // Moloz stops
  { key: 'moloz-fatih', title: 'Moloz - Fatih', category: 'Moloz', lat: 41.01061327786868, lng: 39.722575569877826 },
  { key: 'moloz-pinaralti-sayvan', title: 'Moloz - Pınaraltı Sayvan', category: 'Moloz', lat: 41.01119588041446, lng: 39.7181466919046 },
  { key: 'moloz-aktoprak', title: 'Moloz - Aktoprak', category: 'Moloz', lat: 41.0110987309658, lng: 39.71801794567291 },
  { key: 'moloz-karlik', title: 'Moloz - Karlık', category: 'Moloz', lat: 41.01119588039435, lng: 39.71806086103921 },
  { key: 'moloz-gurbulak', title: 'Moloz - Gürbulak', category: 'Moloz', lat: 41.01100158141222, lng: 39.718103776499575 },
  { key: 'moloz-gecit-magmat', title: 'Moloz - Geçit Mağmat', category: 'Moloz', lat: 41.0109044317116, lng: 39.71797503039499 },
  { key: 'moloz-karakaya', title: 'Moloz - Karakaya', category: 'Moloz', lat: 41.01064536509651, lng: 39.71797503027523 },
  { key: 'moloz-akkaya', title: 'Moloz - Akkaya', category: 'Moloz', lat: 41.01074251515645, lng: 39.71801794565265 },
  { key: 'moloz-subasi', title: 'Moloz - Subaşı', category: 'Moloz', lat: 41.01077489852321, lng: 39.718060861044755 },
  { key: 'moloz-kirechane', title: 'Moloz - Kireçhane', category: 'Moloz', lat: 41.01061298164838, lng: 39.717907049706525 },
  { key: 'moloz-yenikoy-ugurlu', title: 'Moloz - Yeniköy Uğurlu', category: 'Moloz', lat: 41.0103539139439, lng: 39.71808216105399 },
  { key: 'moloz-agilli', title: 'Moloz - Ağıllı', category: 'Moloz', lat: 41.01090443170341, lng: 39.718404183829996 },
  { key: 'moloz-dogancay', title: 'Moloz - Doğançay', category: 'Moloz', lat: 41.010904431690896, lng: 39.71836126852998 },
  { key: 'moloz-bahcecik', title: 'Moloz - Bahçecik', category: 'Moloz', lat: 41.01105045238021, lng: 39.72318795037495 },
  { key: 'moloz-besirli', title: 'Moloz - Beşirli', category: 'Moloz', lat: 41.01095330274293, lng: 39.72294123135833 },
  { key: 'moloz-yenimahalle', title: 'Moloz - Yenimahalle', category: 'Moloz', lat: 41.01071042801193, lng: 39.72276606601601 },
  { key: 'moloz-degirmendere', title: 'Moloz - Değirmendere', category: 'Moloz', lat: 41.010856238906044, lng: 39.723359556390164 },
  { key: 'moloz-karsiyaka', title: 'Moloz - Karşıyaka', category: 'Moloz', lat: 41.01075575748531, lng: 39.72327372418408 },
  { key: 'moloz-aydinlikevler', title: 'Moloz - Aydınlıkevler', category: 'Moloz', lat: 41.01072764882014, lng: 39.723295689209294 },
  { key: 'moloz-yesiltepe', title: 'Moloz - Yeşiltepe', category: 'Moloz', lat: 41.01079138635507, lng: 39.72313307738533 },
  { key: 'moloz-camlik', title: 'Moloz - Çamlık', category: 'Moloz', lat: 41.010783376474485, lng: 39.723649234964675 },
  { key: 'moloz-kurucesme', title: 'Moloz - Kuruçeşme', category: 'Moloz', lat: 41.01075575748531, lng: 39.72327372418408 }, // wait, corrected duplicate/bad coords
  { key: 'moloz-catak', title: 'Moloz - Çatak', category: 'Moloz', lat: 41.010564788694694, lng: 39.723423929424015 },
  { key: 'moloz-camiyani', title: 'Moloz - Camiyanı', category: 'Moloz', lat: 41.01057288454504, lng: 39.72335955640349 },
  { key: 'moloz-caglayan', title: 'Moloz - Çağlayan', category: 'Moloz', lat: 41.01044335072484, lng: 39.7235634042647 },
  { key: 'moloz-yalincak', title: 'Moloz - Yalıncak', category: 'Moloz', lat: 41.01033998278301, lng: 39.72345925167443 }
];

export function TransportScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, 'Transport'>>();
  const [detailKey, setDetailKey] = React.useState<TransportDetailKey>(null);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const lastNavTriggerRef = React.useRef<number>(0);

  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [expandedKart, setExpandedKart] = React.useState<
    'anonim' | 'indirimli' | 'ucretsiz' | 'standart' | null
  >(null);

  // Dolmuş state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStops, setSelectedStops] = React.useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    Postane: false,
    Tanjant: false,
    Moloz: false,
  });
  const [groupMasterSelected, setGroupMasterSelected] = React.useState<Record<string, boolean>>({
    Postane: false,
    Tanjant: false,
    Moloz: false,
  });
  const [userCoords, setUserCoords] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const userCoordsRef = React.useRef<{ latitude: number; longitude: number } | null>(null);
  const [showMyLocation, setShowMyLocation] = React.useState(false);
  const showMyLocationRef = React.useRef(false);
  const mapRef = React.useRef<any>(null);
  const markersRef = React.useRef<Record<string, any>>({});
  const userMarkerRef = React.useRef<any>(null);
  const scrollRef = React.useRef<any>(null);

  const handleStopPress = (stopKey: string, groupName: string) => {
    const groupStops = DOLMUS_STOPS.filter(s => s.category === groupName).map(s => s.key);

    if (groupMasterSelected[groupName]) {
      // Override: deselect all other stops in this group, select only this one
      setSelectedStops(prev => {
        const filtered = prev.filter(k => !groupStops.includes(k));
        return [...filtered, stopKey];
      });
      setGroupMasterSelected(prev => ({ ...prev, [groupName]: false }));
    } else {
      // Normal toggle
      setSelectedStops(prev => {
        if (prev.includes(stopKey)) {
          return prev.filter(k => k !== stopKey);
        } else {
          return [...prev, stopKey];
        }
      });
    }
  };

  const handleMasterToggle = (groupName: string) => {
    const groupStops = DOLMUS_STOPS.filter(s => s.category === groupName).map(s => s.key);
    const isCurrentlyMasterSelected = groupMasterSelected[groupName];

    if (isCurrentlyMasterSelected) {
      // Deselect all in this group
      setSelectedStops(prev => prev.filter(k => !groupStops.includes(k)));
      setGroupMasterSelected(prev => ({ ...prev, [groupName]: false }));
    } else {
      // Select all in this group
      setSelectedStops(prev => {
        const filtered = prev.filter(k => !groupStops.includes(k));
        return [...filtered, ...groupStops];
      });
      setGroupMasterSelected(prev => ({ ...prev, [groupName]: true }));
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

    if (locationLoading) return;
    try {
      setLocationLoading(true);

      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          alert("Tarayıcınız konum özelliğini desteklemiyor.");
          setLocationLoading(false);
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
            setLocationLoading(false);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            let errorMsg = "Konum alınamadı.";
            if (error.code === error.PERMISSION_DENIED) {
              errorMsg = "Konum izni reddedildi. Lütfen tarayıcınızın adres çubuğundaki kilit simgesinden izni aktif edin.";
            }
            alert(errorMsg);
            setLocationLoading(false);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum izni vermeniz gerekmektedir.');
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
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
      if (Platform.OS !== 'web') {
        setLocationLoading(false);
      }
    }
  };

  // Synchronize user location marker on Leaflet map
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

  // Sync stops markers on Leaflet map
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

    const stopsToShow = selectedStops.length === 0
      ? DOLMUS_STOPS
      : DOLMUS_STOPS.filter(s => selectedStops.includes(s.key));

    const pointsData = stopsToShow.map(stop => {
      let color = '#3B82F6';
      if (stop.category === 'Postane') color = '#1E3A8A';
      else if (stop.category === 'Tanjant') color = '#2563EB';
      else if (stop.category === 'Moloz') color = '#38BDF8';

      return {
        key: stop.key,
        title: stop.title,
        lat: stop.lat,
        lng: stop.lng,
        color: color,
        svgIcon: `<path d="M400 192H112a32 32 0 00-32 32v144a32 32 0 0032 32h16a32 32 0 0032-32v-16h208v16a32 32 0 0032 32h16a32 32 0 0032-32V224a32 32 0 00-32-32zm-256 128a24 24 0 1124-24 24 24 0 01-24 24zm192 0a24 24 0 1124-24 24 24 0 01-24 24z"/>`
      };
    });

    pointsData.forEach(point => {
      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.style.padding = '6px';
      popupContent.style.textAlign = 'center';
      popupContent.style.minWidth = '140px';

      const titleEl = document.createElement('b');
      titleEl.style.fontSize = '14px';
      titleEl.style.color = '#1F2937';
      titleEl.style.display = 'block';
      titleEl.style.marginBottom = '8px';
      titleEl.textContent = point.title;
      popupContent.appendChild(titleEl);

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
        const now = Date.now();
        if (now - lastNavTriggerRef.current < 1500) return;
        lastNavTriggerRef.current = now;
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`);
      };
      popupContent.appendChild(btnEl);

      const markerHtml = `
        <div class="custom-marker" id="marker-${point.key}">
          <div class="marker-bubble" style="background-color: ${point.color}; width: 28px; height: 28px; border-radius: 14px;">
            <svg style="width: 16px; height: 16px; fill: white;" viewBox="0 0 512 512">${point.svgIcon}</svg>
          </div>
          <div class="marker-arrow" style="background-color: ${point.color};"></div>
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

      markersRef.current[point.key] = marker;
    });

    syncUserLocation();

    // Fit map bounds to the rendered markers
    if (pointsData.length > 0) {
      const markersArray = Object.values(markersRef.current);
      const group = new L.featureGroup(markersArray);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [selectedStops, syncUserLocation]);

  // Maintain syncMarkers ref to avoid breaking initializeMap dependency chain
  const syncMarkersRef = React.useRef(syncMarkers);
  React.useEffect(() => {
    syncMarkersRef.current = syncMarkers;
  });

  const selectPinLocal = React.useCallback((key: string, openPopup: boolean) => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (map && markers[key]) {
      map.setView(markers[key].getLatLng(), 16, { animate: true });
      if (openPopup) {
        markers[key].openPopup();
      }
    }
  }, []);

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
      }).setView([40.997500, 39.712500], 13); // target focus coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      mapRef.current = map;
      syncMarkersRef.current();
    }).catch((err) => {
      console.error('Failed to load Leaflet map in TransportScreen:', err);
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

  // Re-sync markers when selectedStops changes
  React.useEffect(() => {
    if (mapRef.current) {
      syncMarkers();
    }
  }, [selectedStops, syncMarkers]);

  // Re-sync user location
  React.useEffect(() => {
    if (mapRef.current) {
      syncUserLocation();
    }
  }, [syncUserLocation]);

  const goBack = () => {
    setDetailKey(null);
    setLocationLoading(false);
    setLocationError(null);
    setExpandedKart(null);
    setSearchQuery('');
    setSelectedStops([]);
    setGroupMasterSelected({ Postane: false, Tanjant: false, Moloz: false });
    setUserCoords(null);
    userCoordsRef.current = null;
    setShowMyLocation(false);
    showMyLocationRef.current = false;
    navigation.setParams({ detailKey: undefined });
  };

  React.useEffect(() => {
    const incoming = route.params?.detailKey;
    setDetailKey(incoming || null);
  }, [route.params?.detailKey]);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  // Tab press sıfırlama: aktif sekmeye tekrar basıldığında ana listeye dön ve scroll'u sıfırla
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress' as any, () => {
      // Tüm state'i temizle (goBack ile aynı mantık)
      setDetailKey(null);
      setLocationLoading(false);
      setLocationError(null);
      setExpandedKart(null);
      setSearchQuery('');
      setSelectedStops([]);
      setGroupMasterSelected({ Postane: false, Tanjant: false, Moloz: false });
      setUserCoords(null);
      userCoordsRef.current = null;
      setShowMyLocation(false);
      showMyLocationRef.current = false;
      navigation.setParams({ detailKey: undefined });
      // Ana ScrollView'i en üste kaydır
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    });
    return unsubscribe;
  }, [navigation]);



  if (detailKey === 'dolmus') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>
          <Text style={styles.title}>Dolmuş Hatları</Text>

          {/* Translucent Blue Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { outlineStyle: 'none', outlineWidth: 0 } as any]}
              placeholder="Gitmek istediğiniz durağı yazın (Örn: Bahçecik)..."
              placeholderTextColor="rgba(37, 99, 235, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.searchClear}>
                <Ionicons name="close-circle" size={16} color={colors.primary} />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Map Wrapper with Floating Location Button */}
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
              {locationLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name={showMyLocation ? "locate" : "locate-outline"} size={20} color={showMyLocation ? colors.primary : "#374151"} />
              )}
            </Pressable>
          </View>

          {/* Compact Fares Info */}
          <View style={[styles.fareCardCompact, cardShadow]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
              <Ionicons name="cash-outline" size={16} color={colors.primary} style={{ marginTop: 2 }} />
              <Text style={{ fontWeight: '800', fontSize: 13, color: colors.textPrimary, marginTop: 1 }}>Ücretler:</Text>
              <Text style={{ fontWeight: '700', fontSize: 13, color: colors.textSecondary, flex: 1, flexShrink: 1 }}>Sivil: 32 TL | Öğrenci: 23 TL | Üniversite Öğrenci: 25 TL (sadece KTÜ dolmuşlarında geçerlidir. Diğer hatlarda üniversite öğrencileri sivil ücrete tabiidir.)</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#7f8c8d', fontStyle: 'italic', marginTop: 4 }}> Son Güncelleme: 2026/Temmuz </Text>
          </View>

          {/* Accordion Filters */}
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            {['Postane', 'Tanjant', 'Moloz'].map((groupName) => {
              const isExpanded = expandedGroups[groupName];
              const isMasterSelected = groupMasterSelected[groupName];

              const stopsInGroup = DOLMUS_STOPS.filter(s => {
                if (s.category !== groupName) return false;
                if (searchQuery.trim() !== '') {
                  const toLowerTR = (str: string) => str.replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase();
                  return toLowerTR(s.title).includes(toLowerTR(searchQuery));
                }
                return true;
              });

              if (stopsInGroup.length === 0 && searchQuery.trim() !== '') {
                return null;
              }

              return (
                <View key={groupName} style={[styles.dolmusAccordionCard, cardShadow]}>
                  {/* Accordion Header */}
                  <View style={styles.dolmusAccordionHeader}>
                    {/* Master Toggle */}
                    <Pressable
                      onPress={() => handleMasterToggle(groupName)}
                      style={styles.dolmusMasterToggle}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isMasterSelected ? "checkbox" : "square-outline"}
                        size={20}
                        color={isMasterSelected ? colors.primary : colors.textMuted}
                      />
                    </Pressable>

                    {/* Accordion Title (Expand/Collapse) */}
                    <Pressable
                      onPress={() => setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                      style={styles.dolmusAccordionTitleContainer}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dolmusAccordionGroupTitle}>{groupName} Hattı</Text>
                        <Text style={styles.dolmusAccordionGroupSub}>{stopsInGroup.length} durak</Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  </View>

                  {/* Stops List */}
                  {isExpanded && (
                    <View style={styles.dolmusStopsList}>
                      {stopsInGroup.map((stop) => {
                        const isSelected = selectedStops.includes(stop.key);
                        let stopColor = '#3B82F6';
                        if (stop.category === 'Postane') stopColor = '#1E3A8A';
                        else if (stop.category === 'Tanjant') stopColor = '#2563EB';
                        else if (stop.category === 'Moloz') stopColor = '#38BDF8';

                        return (
                          <Pressable
                            key={stop.key}
                            onPress={() => {
                              handleStopPress(stop.key, groupName);
                              selectPinLocal(stop.key, false);
                            }}
                            style={[
                              styles.dolmusStopItem,
                              isSelected && { backgroundColor: stopColor, borderColor: stopColor }
                            ]}
                          >
                            <Ionicons
                              name="bus-outline"
                              size={13}
                              color={isSelected ? '#FFF' : stopColor}
                            />
                            <Text
                              style={[
                                styles.dolmusStopItemText,
                                isSelected && { color: '#FFF' },
                                !isSelected && { color: colors.textPrimary }
                              ]}
                            >
                              {stop.title.replace('Postane - ', 'P - ').replace('Tanjant - ', 'T - ').replace('Moloz - ', 'M - ')}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'havalimani') {
    const openUrl = async (url: string) => {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    };

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Havaalanı</Text>
          <Text style={styles.lead}>
            Trabzon Havalimanı’na ulaşım seçenekleri ve pratik bilgiler
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="rocket-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Hızlı Ulaşım</Text>
            </View>

            <View style={styles.airportQuickGrid}>
              {/* Dolmuş — yan yana sol */}
              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBordo]}>
                  <Ionicons
                    name="car-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.airportQuickTitle}>Dolmuş</Text>
                <Text style={styles.airportQuickDesc}>
                  Moloz - Havalimanı ve Tanjant hatları
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Dolmuş hatlarını görüntüle"
                  onPress={() => setDetailKey('dolmus')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Dolmuş hatlarını görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>

              {/* Havaş — yan yana sağ */}
              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBlue]}>
                  <Ionicons
                    name="bus-outline"
                    size={20}
                    color={colors.secondary}
                  />
                </View>
                <Text style={styles.airportQuickTitle}>Havaş</Text>
                <Text style={styles.airportQuickDesc}>
                  Merkez ve Rize yönüne servis
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Havaş detaylarını görüntüle"
                  onPress={() => setDetailKey('havas')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Havaş detaylarını görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="pin-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Havalimanı Konumu</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Trabzon Havalimanı şehir merkezine yakın konumdadır.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Haritada Aç"
              onPress={() => openUrl('https://maps.app.goo.gl/aYm5jcTHfznM8wkd6')}
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>Haritada Aç</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Faydalı Bilgiler</Text>
            </View>

            <View style={styles.tipsList}>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  El bagajında 100 ml üzeri sıvılar kabine alınmaz.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  İç hat uçuşlarında kimlik kartını yanında bulundur.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  İç hat uçuşları için en az 1.5 saat önce havalimanında ol.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Güvenlik kontrolünden geçerken metal eşyaları çıkar.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Çakı, makas ve kesici ürünler kabin bagajında yasaktır.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Powerbank ürünleri uçak altı bagajına verilmez, kabin bagajında
                  taşınmalıdır.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Telefon ve elektronik cihazlar uçuş sırasında uçak modunda
                  olmalıdır.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ücret Tarifeleri</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Resmi ücret tarifelerine DHMİ sayfasından ulaşabilirsin.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="DHMİ Ücret Tarifeleri"
              onPress={() =>
                openUrl('https://dhmi.gov.tr/Sayfalar/UcretTarifeleri.aspx')
              }
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>DHMİ Ücret Tarifeleri</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'havas') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Havaş</Text>
          <Text style={styles.lead}>Trabzon Havalimanı servis bilgileri</Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ücretler</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Trabzon Meydan: 100 TL</Text>
              <Text style={styles.detailBullet}>- Tanjant Migros: 140 TL</Text>
              <Text style={styles.detailBullet}>- Beşirli: 140 TL</Text>
              <Text style={styles.detailBullet}>- Of: 250 TL</Text>
              <Text style={styles.detailBullet}>- Rize: 300 TL</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#7f8c8d', fontStyle: 'italic', marginTop: 4 }}> Son Güncelleme: 2026/Temmuz </Text>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="pin-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Yolcu alma noktaları</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Beşirli Opet</Text>
              <Text style={styles.detailBullet}>
                - Karşıyaka Kavşağı Otobüs Durağı
              </Text>
              <Text style={styles.detailBullet}>- Tanjant Migros önü</Text>
              <Text style={styles.detailBullet}>
                - Zeytinlik Belediye Otobüs Durağı / TS Club önü
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="git-branch-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Güzergah</Text>
            </View>

            <Text style={[styles.sectionDesc, { marginTop: 10 }]}>
              Beşirli → Tanjant → Trabzon Havalimanı
            </Text>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons
                  name="compass-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Rize yönü</Text>
            </View>

            <Text style={[styles.sectionDesc, { marginTop: 10 }]}>
              Trabzon Havalimanı → Şana → Yomra → Arsin → Araklı → Sürmene → Of →
              İyidere → Derepazarı → Rize Merkez
            </Text>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Uyarı</Text>
            </View>

            <View style={[styles.havasWarnCard, { marginTop: 10 }]}>
              <Ionicons
                name="call-outline"
                size={18}
                color={colors.textMuted}
              />
              <Text style={styles.havasWarnText}>
                Kesin saat bilgisi için Havaş çağrı merkezini arayınız: 0850 222 0
                487
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 5, flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>Trabzon’da hareket</Text>
          <Text style={styles.title}>Ulaşım</Text>
          <Text style={styles.lead}>
            Kısa süreli ziyaretlerde merkez, sahil ve tur rotaları arasında
            geçişler için tüm seçenekler. Canlı saatler ileride eklenecek.
          </Text>

          {TRANSPORT_ALL.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.card,
                cardShadow,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => {
                if (item.key === 'dolmus') setDetailKey('dolmus');
                if (item.key === 'havaalani') setDetailKey('havalimani');
              }}
            >
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon} size={26} color={colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardText}>{BLURBS[item.key]}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        <Image
          source={require('../assets/ortahisar_motto.png')}
          style={styles.mottoImage}
          resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  lead: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sectionHeaderIconMap: {
    backgroundColor: colors.surface,
  },
  sectionHeaderIconQr: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderIconStops: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionDesc: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  sectionMinor: {
    marginTop: 10,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textMuted,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  onlineGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  onlineTile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  tilePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileIconWrapBlue: {
    backgroundColor: colors.surface,
  },
  tileIconWrapBordo: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  tileTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  airportQuickGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  airportQuickTile: {
    width: '48.5%',
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airportQuickTileFull: {
    width: '100%',
  },
  airportQuickTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  airportQuickDesc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  airportMiniBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  airportMiniBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.secondary,
    textAlign: 'center',
    flex: 1,
  },
  havasWarnCard: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  havasWarnText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  tipsList: {
    marginTop: 12,
    gap: 10,
  },
  tipCard: {
    backgroundColor: colors.searchBg,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  subSectionTitle: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  bulletList: {
    marginTop: 10,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    marginTop: 7,
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  divider: {
    marginTop: 12,
    height: 1,
    backgroundColor: colors.border,
  },
  accordionCard: {
    backgroundColor: colors.searchBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  accordionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accordionIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  accordionIconBlue: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.border,
  },
  accordionTopBody: {
    flex: 1,
    minWidth: 0,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  accordionSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  accordionDetail: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  detailHeading: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  detailBullets: {
    marginTop: 6,
    gap: 6,
  },
  detailBullet: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  mapCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  mapButton: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.seaDeep,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  qrImageWrap: {
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 6,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrImage: {
    width: 170,
    height: 170,
    borderRadius: 14,
  },
  popularCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  popRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },
  popRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  popRowBody: {
    flex: 1,
  },
  popRowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  popRowBlurb: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  popDivider: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  lineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  lineIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  lineBody: {
    flex: 1,
  },
  lineTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  lineBlurb: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
    backgroundColor: colors.searchBg,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.12)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  searchClear: {
    padding: 4,
  },
  mapWrapper: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 10,
    height: 250,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  webviewStyle: {
    width: '100%',
    height: '100%',
  },
  locationBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareCardCompact: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dolmusAccordionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dolmusAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  dolmusMasterToggle: {
    marginRight: 12,
    padding: 2,
  },
  dolmusAccordionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dolmusAccordionGroupTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dolmusAccordionGroupSub: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  dolmusStopsList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: colors.searchBg,
  },
  dolmusStopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dolmusStopItemText: {
    fontSize: 12,
    fontWeight: '700',
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
});
