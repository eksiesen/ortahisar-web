import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TRANSPORT_QUICK } from '../../constants/data';
import { cardShadow } from '../../constants/layout';
import { colors, radius } from '../../theme';

import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../../navigation/types';

const CARD_BG = ['#FFFFFF', colors.primarySoft] as const;

export function TransportCarousel() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.row}>
      {TRANSPORT_QUICK.map((item, index) => (
        <Pressable
          key={item.key}
          onPress={() => navigation.navigate('Transport', { detailKey: item.key })}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: CARD_BG[index % CARD_BG.length] },
            cardShadow,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={30} color={colors.primary} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.secondary}18`,
    minWidth: 0,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(134, 31, 63, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}22`,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
