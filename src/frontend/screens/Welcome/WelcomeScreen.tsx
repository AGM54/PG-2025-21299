import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { styles } from './styles';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Image source={require('../../assets/ini.png')} style={styles.character} />

        <Text style={styles.title}>Bienvenido</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.leftButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.rightButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

