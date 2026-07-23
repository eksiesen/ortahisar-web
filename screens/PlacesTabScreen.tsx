import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PLACE_CATEGORIES,
} from '../constants/data';
import { cardShadow } from '../constants/layout';
import {
  HistoricalPlacesScreen,
  type HistoricalPlace,
  HISTORICAL_PLACES,
} from './HistoricalPlacesScreen';
import { HistoricalPlaceDetailScreen } from './HistoricalPlaceDetailScreen';
import { ParksScreen, type Park, PARKS } from './ParksScreen';
import { ParkDetailScreen } from './ParkDetailScreen';
import { ViewpointsScreen, type ViewpointSpot, VIEWPOINTS } from './ViewpointsScreen';
import { ViewpointDetailScreen } from './ViewpointDetailScreen';
import { MuseumsScreen, type Museum, MUSEUMS } from './MuseumsScreen';
import { MuseumDetailScreen } from './MuseumDetailScreen';

import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';

type PlacesView =
  | 'root'
  | 'tarihi'
  | 'tarihi-detail'
  | 'parklar'
  | 'parklar-detail'
  | 'manzara'
  | 'manzara-detail'
  | 'muzeler'
  | 'muzeler-detail';

export function PlacesTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [view, setView] = React.useState<PlacesView>('root');
  const [selectedHistorical, setSelectedHistorical] =
    React.useState<HistoricalPlace | null>(null);
  const [selectedPark, setSelectedPark] = React.useState<Park | null>(null);
  const [selectedViewpoint, setSelectedViewpoint] =
    React.useState<ViewpointSpot | null>(null);
  const [selectedMuseum, setSelectedMuseum] = React.useState<Museum | null>(null);
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, 'Places'>>();
  const [showStickyBack, setShowStickyBack] = React.useState(false);
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const prevViewRef = React.useRef<PlacesView | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('tabPress_Places', () => {
      if (view !== 'root') {
        setView('root');
      } else {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => sub.remove();
  }, [view]);

  React.useEffect(() => {
    setShowStickyBack(false);
    setShowListStickyBack(false);
    prevViewRef.current = view;
  }, [view]);

  React.useEffect(() => {
    const categoryKey = route.params?.categoryKey;
    const detailKey = route.params?.detailKey;

    if (categoryKey) {
      if (categoryKey === 'tarihi' && detailKey) {
        const found = HISTORICAL_PLACES.find((p) => p.key === detailKey);
        if (found) {
          setSelectedHistorical(found);
          setView('tarihi-detail');
        } else {
          setView('tarihi');
        }
      } else if (categoryKey === 'muze' && detailKey) {
        const found = MUSEUMS.find((p) => p.key === detailKey);
        if (found) {
          setSelectedMuseum(found);
          setView('muzeler-detail');
        } else {
          setView('muzeler');
        }
      } else if (categoryKey === 'park' && detailKey) {
        const found = PARKS.find((p) => p.key === detailKey);
        if (found) {
          setSelectedPark(found);
          setView('parklar-detail');
        } else {
          setView('parklar');
        }
      } else if (categoryKey === 'manzara' && detailKey) {
        const found = VIEWPOINTS.find((p) => p.key === detailKey);
        if (found) {
          setSelectedViewpoint(found);
          setView('manzara-detail');
        } else {
          setView('manzara');
        }
      } else {
        setView((categoryKey === 'muze' ? 'muzeler' : (categoryKey === 'park' ? 'parklar' : categoryKey)) as PlacesView);
      }
      navigation.setParams({ categoryKey: undefined, detailKey: undefined });
    }
  }, [route.params?.categoryKey, route.params?.detailKey]);

  const openUrl = async (url: string) => {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Root view */}
      <View style={{ display: view === 'root' ? 'flex' : 'none', flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 5, flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={true}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Gezilecek Yerler</Text>
              <Text style={styles.heroLead}>
                İlçelere dağılan doğa ve tarih duraklarından Boztepe manzarasına —
                Trabzon gezisinde öncelik vereceğin başlıklar.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Kategoriler</Text>
            <View style={styles.catWrap}>
              {PLACE_CATEGORIES.map((c) => (
                <Pressable
                  key={c.key}
                  style={({ pressed }) => [
                    styles.catCard,
                    {
                      backgroundColor: c.color + '0D', // Çok soft arka plan
                      borderLeftWidth: 4,
                      borderLeftColor: c.color,
                      borderColor: 'transparent',
                    },
                    cardShadow,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={c.label}
                  onPress={() => {
                    if (c.key === 'tarihi') setView('tarihi');
                    if (c.key === 'muze') setView('muzeler');
                    if (c.key === 'park') setView('parklar');
                    if (c.key === 'manzara') setView('manzara');
                  }}
                >
                  <View style={[styles.catIcon, { backgroundColor: c.color + '1A', borderColor: 'transparent' }]}>
                    <Ionicons name={c.icon} size={24} color={c.color} />
                  </View>
                  <Text style={[styles.catTitle, { color: c.color }]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Image
            source={require('../assets/ortahisar_motto.png')}
            style={styles.mottoImage}
            resizeMode="contain"
          />
        </ScrollView>
      </View>
      {/* Tarihi list */}
      <View style={{ display: view === 'tarihi' ? 'flex' : 'none', flex: 1 }}>
        <HistoricalPlacesScreen
          onBack={() => setView('root')}
          onSelect={(place) => {
            setSelectedHistorical(place);
            setView('tarihi-detail');
          }}
          view={view}
        />
      </View>

      {/* Tarihi detail */}
      {view === 'tarihi-detail' && selectedHistorical && (
        <HistoricalPlaceDetailScreen
          place={selectedHistorical}
          onBack={() => setView('tarihi')}
        />
      )}

      {/* Parklar list */}
      <View style={{ display: view === 'parklar' ? 'flex' : 'none', flex: 1 }}>
        <ParksScreen
          onBack={() => setView('root')}
          onSelect={(park) => {
            setSelectedPark(park);
            setView('parklar-detail');
          }}
          view={view}
        />
      </View>

      {/* Parklar detail */}
      {view === 'parklar-detail' && selectedPark && (
        <ParkDetailScreen
          park={selectedPark}
          onBack={() => setView('parklar')}
        />
      )}

      {/* Manzara list */}
      <View style={{ display: view === 'manzara' ? 'flex' : 'none', flex: 1 }}>
        <ViewpointsScreen
          onBack={() => setView('root')}
          onSelect={(spot) => {
            setSelectedViewpoint(spot);
            setView('manzara-detail');
          }}
          view={view}
        />
      </View>

      {/* Manzara detail */}
      {view === 'manzara-detail' && selectedViewpoint && (
        <ViewpointDetailScreen
          spot={selectedViewpoint}
          onBack={() => setView('manzara')}
        />
      )}

      {/* Museums list */}
      <View style={{ display: view === 'muzeler' ? 'flex' : 'none', flex: 1 }}>
        <MuseumsScreen
          onBack={() => setView('root')}
          onSelect={(museum) => {
            setSelectedMuseum(museum);
            setView('muzeler-detail');
          }}
          view={view}
        />
      </View>

      {/* Museums detail */}
      {view === 'muzeler-detail' && selectedMuseum && (
        <MuseumDetailScreen
          museum={selectedMuseum}
          onBack={() => setView('muzeler')}
        />
      )}
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
  sectionMinor: {
    marginTop: 12,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textMuted,
  },
  restaurantCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.searchBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantName: {
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  restaurantBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: colors.secondary,
  },
  restaurantNote: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.textMuted,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  primaryBtn: {
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
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
  },
  secondaryBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  detailCoverCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  detailCoverImg: {
    height: 220,
    width: '100%',
  },
  detailCoverImgRadius: {
    borderRadius: radius.xl,
  },
  detailCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.12)',
  },
  detailTitle: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  detailMeta: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondary,
  },
  detailTags: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailDesc: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBullets: {
    marginTop: 6,
    gap: 6,
  },
  detailBullet: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBulletStrong: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  howBlock: {
    marginTop: 12,
  },
  howTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  howText: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  howInfoBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.searchBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  howInfoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  howInfoText: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  howWarnBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  howSuggestBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.secondarySoft,
  },
  detailDivider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
  },
  hero: {
    marginBottom: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.secondarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  heroLead: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  catWrap: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
  },
  catCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: '35%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 22,
  },
  destCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  destImg: {
    minHeight: 208,
    justifyContent: 'space-between',
  },
  destImgRadius: {
    borderRadius: radius.xl,
  },
  destImgPosition: {
    height: '140%',
    top: '-30%',
  },
  destOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayStrong,
    borderRadius: radius.xl,
  },
  destTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  tagText: {
    color: colors.onImage,
    fontSize: 11,
    fontWeight: '700',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destBottom: {
    padding: 18,
  },
  destTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onImage,
  },
  destSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.92)',
  },
  gastroIntro: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  gastroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gastroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gastroText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  natureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  natureImg: {
    height: 170,
    width: '100%',
    justifyContent: 'flex-end',
  },
  natureImgRadius: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    // Web: cover + center crop (native ignores safely)
    objectFit: 'cover',
  },
  natureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.18)',
  },
  natureArrow: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  natureBody: {
    padding: 14,
  },
  natureTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  natureDesc: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  natureTags: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  natureTag: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  natureTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
  },
  stickyBackBtn: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -30,
    width: 40,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
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

