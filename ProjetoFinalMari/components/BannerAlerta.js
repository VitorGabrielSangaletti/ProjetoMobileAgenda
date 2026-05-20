import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BannerAlerta({ quantidade, aoPress }) {
  if (quantidade === 0) return null;
  return (
    <TouchableOpacity style={styles.banner} onPress={aoPress}>
      <Text style={styles.texto}>
        🔔 {quantidade} evento{quantidade > 1 ? 's' : ''} urgente{quantidade > 1 ? 's' : ''} nas próximas 24h
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#3a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    margin: 12,
    borderRadius: 8,
    padding: 12,
  },
  texto: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
});
