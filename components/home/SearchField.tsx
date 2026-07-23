import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { cardShadow } from '../../constants/layout';
import { colors, radius } from '../../theme';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  style?: any;
}

export function SearchField({ value, onChangeText, onClear, placeholder, style }: SearchFieldProps) {
  return (
    <View style={[styles.wrap, cardShadow, style]}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder || "Ara..."}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { outlineStyle: 'none', outlineWidth: 0 } as any]}
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={12} style={styles.clearBtn}>
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: 10,
  },
});
