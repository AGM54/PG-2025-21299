import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../../navigation/MainStackNavigator';
import { TabParamList } from '../../navigation/BottomTabNavigator';
import { auth } from '../../firebase.config';
import { useScreenTime } from '../../src/hooks/useScreenTime';
import { logClick } from '../../src/lib/firestore';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<TabParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('Usuario');
  const [greeting, setGreeting] = useState<string>('Buenas tardes');
  
  // Tracking de tiempo en pantalla y eventos
  useScreenTime('Home');

  useEffect(() => {
    // Obtener el nombre del usuario de Firebase Auth
    const user = auth.currentUser;
    if (user && user.displayName) {
      setUserName(user.displayName);
    }

    // Determinar el saludo según la hora del día
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Buenos días');
    } else if (hour >= 12 && hour < 19) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, <Text style={styles.username}>{userName}</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              const uid = auth.currentUser?.uid;
              if (uid) {
                logClick(uid, 'Home', 'AdminMetricsButton');
              }
              navigation.navigate('AdminMetrics');
            }}
          >
            <Ionicons name="analytics" size={28} color="#6366f1" />
          </TouchableOpacity>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Primera Tarjeta - CNEE con navegación */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardCNEE');
            }
            navigation.navigate('Cnne');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardPrimary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardTitle}>¿Qué es la CNEE?</Text>
                <Text style={styles.cardSubtitle}>Descúbrelo aquí</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>3 min</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="book" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>20 min de lectura</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../../assets/queesla.png')} style={styles.cardImageRight} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Segunda Tarjeta - Luz Hogar con navegación */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardLuzHogar');
            }
            navigation.navigate('LuzHogar');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardSecondary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardTitle}>¿Cómo llega la luz a tu hogar?</Text>
                <Text style={styles.cardSubtitle}>Descúbrelo aquí</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>3 min</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="book" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>25 min de lectura</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../../assets/comollega.png')} style={styles.cardImageRight} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tercera Tarjeta - Precios y Factura con navegación */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardPreciosFactura');
            }
            navigation.navigate('PreciosFactura');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardTertiary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardTitle}>Precios y Factura de Energía</Text>
                <Text style={styles.cardSubtitle}>Descúbrelo aquí</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>3 min</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="book" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>15 min de lectura</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../../assets/mujerfactura.png')} style={styles.cardImageRight} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cuarta Tarjeta - Obligaciones de las empresas distribuidoras */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardObligaciones');
            }
            navigation.navigate('Obligaciones');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardQuaternary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 5 }}>
                <Text style={styles.cardTitle} numberOfLines={3}>Obligaciones de las empresas distribuidoras de energía</Text>
                <Text style={styles.cardSubtitle}>Descúbrelo aquí</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>3 min</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="book" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>10 min de lectura</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../../assets/obligaciones.png')} style={styles.cardImageRight} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quinta Tarjeta - Alumbrado público en la factura de energía */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardAlumbrado');
            }
            navigation.navigate('Alumbrado');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardQuinary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardTitle}>Alumbrado público en la factura de energía</Text>
                <Text style={styles.cardSubtitle}>Descúbrelo aquí</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>3 min</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="book" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>12 min de lectura</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../../assets/familiaalumbrado.png')} style={styles.cardImageRight} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Sexta Tarjeta - Galería de Videos */}
        <TouchableOpacity 
          onPress={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              logClick(uid, 'Home', 'CardVideoGallery');
            }
            navigation.navigate('VideoGallery');
          }} 
        >
          <LinearGradient
            colors={['#0a0a0a', '#1a1a2e', '#2a2a3e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardSenary}
          >
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardTitle}>Galería de Videos</Text>
                <Text style={styles.cardSubtitle}>Videos educativos</Text>
                <View style={styles.cardInfoRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="videocam" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>Videos</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="play-circle" size={16} color="#fff" style={styles.infoIcon} />
                    <Text style={styles.cardInfo}>Multimedia</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="play-circle" size={80} color="#a855f7" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

