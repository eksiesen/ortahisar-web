import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow } from '../constants/layout';
import { colors, radius } from '../theme';

export type Park = {
  key: string;
  title: string;
  description: string;
  shortInfo: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
  transport: {
    kind: 'dolmus';
    dolmusText: string;
  };
  /** Ziyaret / uyarı maddeleri; yoksa kart gösterilmez. */
  visitBullets?: readonly string[];
  workHours?: string;
  entranceFee?: string;
  instagram?: string;
};

export const PARKS: readonly Park[] = [


  {
    key: 'besirli-ekopark',
    title: 'Beşirli EkoPark',
    description: `Sahil kenarında yürüyüş ve dinlenme alanı`,
    shortInfo: `Karayollarından devralınan 12 dönümlük alanda yapımı tamamlanan Ekopark; sosyolojik temelli biyolojik gölet, yükseltilmiş ekolojik farkındalık yolu, yükseltilmiş ahşap gezinti yolu, ahşap kuş yuvası, dinlenme birimleri ve çocuk oyun alanlarından oluşmaktadır.
Kent halkı tarafından büyük ilgi çeken projenin devamı olarak görünen batıdaki alanın projeyle bütünlük sağlaması açısından düzenleme çalışmaları tamamlanarak hizmete sunulmuştur.`,
    tags: ['Sahil', 'Park', 'Yürüyüş'],
    image: require('../assets/places/ekopark.jpg'),
    mapUrl: 'https://share.google/7KuBuXUQ98y22iCiv',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Beşirli dolmuşları kullanılabilir.',
    },
    workHours: '24 Saat Açık',
    entranceFee: 'Ücretsiz',
  },



  {
    key: 'tunel-akvaryum',
    title: 'Trabzon Tünel Akvaryum',
    description: `Ortahisar Belediyesi’nin benzersiz tünel akvaryum projesi`,
    shortInfo: `Dünyada tünel içinde ilk akvaryum olma özelliğine sahip olan proje, Zağnos ve Tabakhane Vadilerini birbirine bağlayacak şekilde planlanmıştır.
Trabzon Akvaryum 193m. uzunluk,16 m. genişlik,8,5 m. yükseklik sahip olup içinde çeşitli balıklar ve amfibi canlılar bulunmaktadır.19 Mayıs 2022 'de halkın hizmetine açılmıştır.`,
    tags: ['Akvaryum', 'Tünel', 'Turistik'],
    image: require('../assets/places/akvaryum.jpg'),
    mapUrl: 'https://maps.app.goo.gl/TunelAkvaryum',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Bahçecik dolmuşları kullanılabilir.',
    },
    workHours: 'Hafta İçi: 09:00 – 17:00, Hafta Sonu: 10:00 – 18:00',
    entranceFee: 'Yetişkin: 500 TL, Çocuk: 300 TL',
  },
  {
    key: 'en-mutlu-koy',
    title: 'En Mutlu Köy',
    description: `Dezavantajlı bireyler için doğayla uyumlu sosyal ve engelsiz yaşam alanı`,
    shortInfo: `Geçit Mahallesinde mülkiyeti Belediyemize ait 11,419 dekar alanda dezavantajlı bireylerin doğanın terapötik faydalarından yararlanarak engelsiz bireylerle birlikte çalışabilecekleri bir yaşam alanı olarak tasarlanarak hizmete açılmıştır.`,
    tags: ['Yaşam Alanı', 'Sera', 'Doğa', 'Geçit'],
    image: require('../assets/places/en-mutlu.jpg'),
    mapUrl: 'https://maps.app.goo.gl/EnMutluKoy',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Geçit dolmuşları kullanılabilir.',
    },
  },
  {
    key: 'saglikcilar-parki',
    title: 'Sağlıkçılar Parkı',
    description: `Sağlık çalışanlarımıza ithaf edilen modern sosyal dinlenme alanı`,
    shortInfo: `Ortahisar Belediyesi tarafından yapılan ve sağlık çalışanlarımıza ithaf edilen modern sosyal dinlenme alanıdır. Alanımız toplam 9.565 m2 dir. Sert zeminler içinde yürüyüş yolları, 600 m2 lik çocuk oyun alanı, 28 adet oturma bankı, 110 m2 kapalı cafe-wc alanı, 310 m2 açık cafe alanı bulunmaktadır. 
Alanımızda 10 adet çatısı cam kaplı pergola bulunmaktadir. Alanımızda 5 adet fitnes aleti bulunmaktadır. Proje tamamlanarak 14 Mart 2023 tarihinde açılışı gerçekleştirildi.`,
    tags: ['Park', 'Yeşil Alan', 'Erdoğdu'],
    image: require('../assets/places/saglikcilar.jpg'),
    mapUrl: 'https://maps.app.goo.gl/SaglikcilarParki',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Erdoğdu dolmuşları kullanılabilir.',
    },
  },
] as const;

export function ParksScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (park: Park) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'parklar' && prevViewRef.current === 'root') {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
    prevViewRef.current = view;
  }, [view]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 28 },
        ]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowListStickyBack(offsetY > 180);
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
          <Text style={styles.backText}>Gezilecek Yerler</Text>
        </Pressable>

        <Text style={styles.heroTitle}>Parklar</Text>
        <Text style={styles.heroLead}>
          Şehir parkları, yürüyüş alanları ve dinlenme noktaları.
        </Text>

        <View style={{ marginTop: 12 }}>
          {PARKS.map((p) => (
            <Pressable
              key={p.key}
              accessibilityRole="button"
              accessibilityLabel={p.title}
              onPress={() => onSelect(p)}
              style={({ pressed }) => [
                styles.card,
                cardShadow,
                pressed && styles.pressed,
              ]}
            >
              <ImageBackground
                source={p.image}
                style={styles.img}
                imageStyle={styles.imgRadius}
                resizeMode="cover"
              >
                <View style={styles.overlay} />
                <View style={styles.arrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.onImage}
                  />
                </View>
              </ImageBackground>

              <View style={styles.body}>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.desc}>{p.description}</Text>
                <View style={styles.tags}>
                  {p.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {showListStickyBack && (
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  img: {
    height: 170,
    width: '100%',
    justifyContent: 'flex-end',
  },
  imgRadius: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    objectFit: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.18)',
  },
  arrow: {
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
  body: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  desc: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tags: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
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
