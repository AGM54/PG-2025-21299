// src/screens/Progress/ProgressScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import styles from './styles';

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Progreso</Text>
        {/* Aquí puedes agregar más componentes del progreso */}
      </View>
    </SafeAreaView>
  );
}

