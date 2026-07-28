import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow } from '../constants/layout';
import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';
import type { Museum } from './MuseumsScreen';
import { MAP_POINTS } from './HomeScreen';

export function MuseumDetailScreen({
  museum,
  onBack,
}: {
  museum: Museum;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [showStickyBack, setShowStickyBack] = React.useState(false);

  const openUrl = async (url: string) => {
    try {
      const mapPoint = MAP_POINTS.find(p => p.detailKey === museum.key || p.key === museum.key);
      if (!mapPoint) {
        const can = await Linking.canOpenURL(url);
        if (can) await Linking.openURL(url);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Uyarı',
          'Konum izni verilmediği için mevcut konumdan rota çizilemiyor. Hedef nokta haritada açılacak.',
          [{ text: 'Tamam' }]
        );
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${mapPoint.lat},${mapPoint.lng}`);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${mapPoint.lat},${mapPoint.lng}`);
    } catch (e) {
      console.warn(e);
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 28 },
        ]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowStickyBack(offsetY > 150);
        }}
        scrollEventThrottle={16}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          onPress={onBack}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.9 }]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={18} color="#6F4E37" />
          <Text style={styles.backText}>Müzeler</Text>
        </Pressable>

        <View style={[styles.coverCard, cardShadow]}>
          <ImageBackground
            source={museum.image}
            style={styles.coverImg}
            imageStyle={styles.coverImgRadius}
            resizeMode="cover"
          >
            <View style={styles.coverOverlay} />
          </ImageBackground>
        </View>

        <Text style={styles.title}>{museum.title}</Text>
        <Text style={styles.meta}>Trabzon / Müze</Text>

        <View style={styles.tags}>
          {museum.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        {!!museum.mapUrl && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons name="pin-outline" size={18} color="#6F4E37" />
              </View>
              <Text style={styles.sectionHeaderTitle}>Konum</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Haritada Aç"
              onPress={() => openUrl(museum.mapUrl)}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.primaryBtnText}>Haritada Aç</Text>
              <Ionicons name="open-outline" size={18} color={colors.surface} />
            </Pressable>
          </View>
        )}

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#6F4E37"
              />
            </View>
            <Text style={styles.sectionHeaderTitle}>Kısa Bilgi</Text>
          </View>
          <Text style={[styles.desc, { marginTop: 10, fontSize: 13.5, lineHeight: 19, fontWeight: '700' }]}>{museum.shortInfo}</Text>
        </View>

        {!!museum.workHours && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="time-outline" size={18} color="#6F4E37" />
              </View>
              <Text style={styles.sectionHeaderTitle}>Çalışma Saatleri</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10 }]}>{museum.workHours}</Text>
          </View>
        )}

        {!!museum.entranceFee && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="cash-outline" size={18} color="#6F4E37" />
              </View>
              <Text style={styles.sectionHeaderTitle}>Giriş Ücreti</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10 }]}>{museum.entranceFee}</Text>
          </View>
        )}

        {!!museum.instagram && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="logo-instagram" size={18} color="#6F4E37" />
              </View>
              <Text style={styles.sectionHeaderTitle}>Sosyal Medya</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10, color: '#3B82F6' }]}>{museum.instagram}</Text>
          </View>
        )}

        {museum.museumCard && (
          <View style={[styles.infoCard, styles.howWarnBox, cardShadow]}>
            <Ionicons name="card-outline" size={20} color="#6F4E37" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.howInfoTitle, { color: '#6F4E37' }]}>
                {museum.museumCard.title}
              </Text>
              <Text style={styles.howInfoText}>
                {museum.museumCard.text}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Back Button */}
      {showStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={onBack}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="#6F4E37" />
        </Pressable>
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
    color: '#6F4E37',
  },
  coverCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  coverImg: {
    height: 220,
    width: '100%',
  },
  coverImgRadius: {
    borderRadius: radius.xl,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.12)',
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
    color: '#6F4E37',
  },
  tags: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#6F4E371A', // Soft brown background
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#6F4E3733',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6F4E37',
  },
  desc: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
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
    backgroundColor: '#6F4E370D',
    borderColor: '#6F4E3733',
  },
  sectionHeaderIconStops: {
    backgroundColor: '#6F4E370D',
    borderColor: '#6F4E3733',
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
  howInfoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6F4E37',
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
    backgroundColor: '#6F4E370D',
    borderColor: '#6F4E3733',
  },
  detailDivider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
  },
  primaryBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#6F4E37', // Brown Theme color
    borderWidth: 1,
    borderColor: '#543C29',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});
