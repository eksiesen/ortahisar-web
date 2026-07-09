import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';

export function HeaderSection() {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <View style={styles.pillRow}>
          <Ionicons name="airplane-outline" size={16} color={colors.primary} />
          <Text style={styles.pillText}>Ziyaretçi rehberi</Text>
        </View>
        <Text style={styles.greeting}>Ortahisar’a hoş geldin</Text>
        <Text style={styles.subtitle}>
          Kısa süreli seyahat ve gezi için ulaşım ve gezilecek yerler.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    marginBottom: 10,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  profileBtn: {
    marginTop: -4,
  },
});
