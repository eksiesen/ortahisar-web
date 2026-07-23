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
import type { Park } from './ParksScreen';
import { MAP_POINTS } from './HomeScreen';

export function ParkDetailScreen({
  park,
  onBack,
}: {
  park: Park;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [showStickyBack, setShowStickyBack] = React.useState(false);

  const openUrl = async (url: string) => {
    try {
      const mapPoint = MAP_POINTS.find(p => p.detailKey === park.key || p.key === park.key);
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

  // Restoran önerisi özelliği kaldırıldı (public scope)
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
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Parklar</Text>
        </Pressable>

        <View style={[styles.coverCard, cardShadow]}>
          <ImageBackground
            source={park.image}
            style={styles.coverImg}
            imageStyle={styles.coverImgRadius}
            resizeMode="cover"
          >
            <View style={styles.coverOverlay} />
          </ImageBackground>
        </View>

        <Text style={styles.title}>{park.title}</Text>
        <Text style={styles.meta}>Trabzon / Park & Rekreasyon</Text>

        {park.tags && park.tags.length > 0 && (
          <View style={styles.tags}>
            {park.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
              <Ionicons name="pin-outline" size={18} color={colors.secondary} />
            </View>
            <Text style={styles.sectionHeaderTitle}>Konum</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Haritada Aç"
            onPress={() => openUrl(park.mapUrl)}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>Haritada Aç</Text>
            <Ionicons name="open-outline" size={18} color={colors.surface} />
          </Pressable>
        </View>

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
            >
              <Ionicons
                name="navigate-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
          </View>

          {park.key === 'en-mutlu-koy' ? (
            <View style={[styles.howBlock, { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, paddingVertical: 4 }]}>
              <Ionicons name="car-outline" size={24} color="#D97706" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#B45309', flex: 1 }}>
                Özel araçla gidilmesi tavsiye edilir.
              </Text>
            </View>
          ) : (
            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Dolmuş</Text>
              <Text style={styles.howText}>{park.transport.dolmusText}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Gör"
                onPress={() =>
                  navigation.navigate('Home')
                }
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.secondaryBtnText}>Haritada Gör</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondary}
                />
              </Pressable>
            </View>
          )}
        </View>

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.secondary}
              />
            </View>
            <Text style={styles.sectionHeaderTitle}>Kısa Bilgi</Text>
          </View>
          <Text style={[styles.desc, { marginTop: 10, fontSize: 13.5, lineHeight: 19, fontWeight: '700' }]}>{park.shortInfo}</Text>
        </View>

        {!!park.workHours && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons name="time-outline" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Çalışma Saatleri</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10 }]}>{park.workHours}</Text>
          </View>
        )}

        {!!park.entranceFee && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons name="cash-outline" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Giriş Ücreti</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10 }]}>{park.entranceFee}</Text>
          </View>
        )}

        {!!park.instagram && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons name="logo-instagram" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Sosyal Medya</Text>
            </View>
            <Text style={[styles.howText, { marginTop: 10, color: '#3B82F6' }]}>{park.instagram}</Text>
          </View>
        )}


        {park.visitBullets && park.visitBullets.length > 0 && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              {park.visitBullets.map((line) => (
                <Text key={line} style={styles.detailBullet}>
                  - {line}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      {showStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={onBack}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.secondary} />
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
    color: colors.textPrimary,
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
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  desc: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
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
    backgroundColor: colors.secondarySoft,
  },
  sectionHeaderIconMap: {
    backgroundColor: colors.surface,
  },
  sectionHeaderIconStops: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderIconQr: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
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
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
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
  detailBullets: {
    gap: 6,
  },
  detailBullet: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});
