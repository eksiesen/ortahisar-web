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

export type Museum = {
  key: string;
  title: string;
  description: string;
  shortInfo: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
  museumCard?: {
    title: string;
    text: string;
  };
  transport?:
  | {
    kind: 'dolmus';
    dolmusText: string;
  }
  | {
    kind: 'single';
    title: string;
    text: string;
  };
  workHours?: string;
  entranceFee?: string;
  instagram?: string;
};

export const MUSEUMS: readonly Museum[] = [
  {
    key: 'ataturk-kosku',
    title: 'Atatürk Köşkü',
    description: 'Atatürk’ün Trabzon ziyaretlerinde konakladığı köşk',
    shortInfo:
      `Avrupa ve Batı Rönesans mimarisinin etkilerini taşıyan ve gösterişli Avrupa simgeleri kullanılan bina, 19. yüzyıl başlarında Trabzon'a hâkim Soğuksu sırtlarında Konstantin Kabayanidis tarafından yazlık ev olarak yaptırılmıştır. Köşkün giriş katında oturma odası, dinlenme odası, yemek odası ve misafir odası bulunmaktadır. Birinci katta çalışma odası, büyük yatak odası, bekleme odası ve toplantı odası vardır. İkinci katta ise iki küçük oda mevcuttur. Atatürk, 1924 yılında Trabzon'a ilk ziyaretini gerçekleştirdiğinde bu köşkte ağırlanmış ancak konaklamamıştır. İkinci kez Kasım 1930'da Trabzon'u tekrar onurlandırdığında köşkte ağırlanmış ve çok memnun kalmıştır. Haziran 1937'de kendisi için düzenlenen köşkte iki gece kalmış ve 11 Haziran gecesi bu köşkte bütün mal varlığını, canından çok sevdiği Türk ulusuna armağan etme kararı almış ve mal varlığının bir listesini hazırlayarak gereğinin yapılması için başbakana göndermiştir. Atatürk Trabzon'daki köşkten mal varlığını milletine adarken şöyle demiştir: 'Mal ve mülk bana ağırlık veriyor. Bunları milletime bağışlamakla ferahlık duyacağım. İnsanın serveti kendi manevi kişiliğinde olmalıdır. Ben büyük milletime daha çok şeyler vermek istiyorum.' Atatürk Köşkü olarak anılan bu bina 1943 yılında müzeye dönüştürülerek hizmete açılmıştır.`,
    tags: ['Müze', 'Tarih', 'Köşk'],
    image: require('../assets/places/ataturk-kosku.jpg'),
    mapUrl: 'https://maps.app.goo.gl/n7fEAbCvx6cQDqMP6',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Çamlık dolmuşları kullanılabilir.',
    },
    entranceFee: 'Yetişkin: 120 TL, Öğrenci: 45 TL',
  },


  {
    key: 'hasan-pasa-hamami',
    title: 'Hasan Paşa Asker Hamamı Müzesi',
    description: 'Ortahisar Belediyesi tarafından restore edilen tarihi hamam müzesi',
    shortInfo:
      `1882 yılında II. Abdulhamit döneminde tamamlanan ve 1 No’lu Erdoğdu Mahallesi’nde yer alan Hasan Paşa Askeri Hamamı Müzesi Trabzon’un önemli kültürel yapılarından biridir.`,
    tags: ['Müze', 'Tarih', 'Hamam Kültürü'],
    image: require('../assets/places/askerihamam.jpg'),
    mapUrl: 'https://maps.app.goo.gl/HasanPasaHamami',
    transport: {
      kind: 'single',
      title: 'Ulaşım Bilgisi',
      text: 'Meydan bölgesine yakın konumda bulunan müzeye şehir merkezinden yürüyerek veya tüm merkez dolmuşlarıyla kolayca ulaşım sağlanabilir.',
    },
    workHours: 'Haftanın her günü 09:00-18:00 (Resmi tatiller dahildir.)',
    entranceFee: 'Sivil: 50 TL, Öğrenci: 20 TL',
    instagram: '@tarihihasanpasahamamımuzesi',
  },
  {
    key: 'trabzon-tarih-muzesi',
    title: 'Trabzon Tarih Müzesi',
    description: 'Trabzon’un köklü geçmişini ve kültürel mirasını yansıtan tarih müzesi',
    shortInfo:
      `Tarih şehri olan ve geçmişi 5000 yıl öncesine dayanan Trabzon'da Tarih Müzesi'nin eksikliğini Ortahisar Belediyemizin açtığı Tarih Müzesi ile gidermiş olduk. Hizmete açtığımız Tarih Müzesinin arşivinde 7800 tarihi belge, 2200 tane fotoğraf var. Müzemizde Osmanlı ve Cumhuriyet döneminin çeşitli yönleri ile anlatan; kent yaşamı, basın tarihi, Trabzonspor'u anlatan eserler yer alıyor. Antik çağlardan beri bir liman kenti olan Trabzon'da limanımızın tarihiyle ilgili objelerin sergilendiği bir odamız da mevcut. Her yönüyle Trabzon'u anlatan kitapların sergilendiği ve 400 tane kitabı bulunan bir de kütüphane düzenledik.`,
    tags: ['Müze', 'Tarih', 'Ortahisar'],
    image: require('../assets/places/trabzon-tarih.jpg'),
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=41.00508984944358,39.72117570210007',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Bahçecik dolmuşları kullanılabilir.',
    },
    workHours: 'Haftanın her günü 09:00-17:00 (Resmi tatiller dahildir.)',
    entranceFee: 'Sivil: 40 TL, Öğrenci: Ücretsiz',
    instagram: '@trtarihmuzes',
  },
  {
    key: 'basin-tarihi-muzesi',
    title: 'Basın Tarihi Müzesi',
    description: 'Trabzon basınının güçlü hafızasını ve arşivini sergileyen müze',
    shortInfo:
      `1865 yılında Anadolu’daki ilk matbaanın kurulduğu, 1869 yılında ikinci gazetenin çıkarıldığı, her dönemde basının en güçlü yerlerinden biri olan Trabzon'un bu büyük hafızasının geleceğe aktarılması amacı ile içerisinde dijital arşivlerin de bulunduğu “Basın Tarihi Müzesi”nin bina tadilat işlemleri tamamlanarak 10 OAcak 2023 Dünya Çalışan Gazeteciler Günü’nde hizmete açıldı.`,
    tags: ['Müze', 'Basın', 'Tarih'],
    image: require('../assets/places/basın-tarihi.jpg'),
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=41.00508984944358,39.72117570210007',
    transport: {
      kind: 'dolmus',
      dolmusText: 'Bahçecik dolmuşları kullanılabilir.',
    },
    workHours: 'Haftanın her günü 09:00-18:00 (Resmi tatiller dahildir.)',
    entranceFee: 'Ücretsiz',
    instagram: '@trabzonbasinmuzesi',
  },

  {
    key: 'resim-heykels-muzesi',
    title: 'Trabzon Resim Heykel Müzesi (yakında)',
    description: '',
    shortInfo: `Kentimizin kültür ve sanat hayatına yeni bir soluk getirecek modern bir heykel ve resim müzesi kurmak için çalışmalarımız sürüyor.`,
    tags: ['Müze', 'Sanat'],
    image: require('../assets/places/resim-heykel.jpg'),
    mapUrl: '',
  },
];

export function MuseumsScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (museum: Museum) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'muzeler' && prevViewRef.current === 'root') {
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

        <Text style={styles.heroTitle}>Müzeler</Text>
        <Text style={styles.heroLead}>
          Tarih ve kültür hazineleri — köşkler, konaklar ve sergi evleri.
        </Text>

        <View style={{ marginTop: 12 }}>
          {MUSEUMS.map((p) => (
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
                {p.description ? <Text style={styles.desc}>{p.description}</Text> : null}
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

      {/* Floating back button that appears on scroll */}
      {showListStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            onBack();
          }}
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
    backgroundColor: 'rgba(111, 78, 55, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6F4E37',
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
