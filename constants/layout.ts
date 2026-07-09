import { Platform } from 'react-native';

export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#1B1F2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  android: {
    elevation: 5,
    shadowColor: '#1B1F2A',
  },
  default: {},
});
