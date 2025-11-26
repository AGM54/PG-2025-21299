import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const dispositivos = [
  { id: 'movil', nombre: 'Móvil', imagen: require('../../../assets/movil.png'), tipoCorrecto: 'DC' },
  { id: 'laptop', nombre: 'Laptop', imagen: require('../../../assets/laptop.png'), tipoCorrecto: 'DC' },
  { id: 'refrigerador', nombre: 'Refrigerador', imagen: require('../../../assets/refrigerador.png'), tipoCorrecto: 'AC' },
  { id: 'televisor', nombre: 'Televisor', imagen: require('../../../assets/televisor.png'), tipoCorrecto: 'AC' },
];

export default function ClasificaCorrienteGame({ onSuccess }: { onSuccess?: () => void }) {
  const [selecciones, setSelecciones] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: 'correcto' | 'incorrecto' | null }>({});

  const seleccionar = (id: string, tipo: string) => {
    const dispositivo = dispositivos.find((d) => d.id === id);
    const esCorrecto = dispositivo?.tipoCorrecto === tipo;

    setSelecciones((prev) => ({ ...prev, [id]: tipo }));
    setFeedback((prev) => ({ ...prev, [id]: esCorrecto ? 'correcto' : null }));
  };

  const verificar = () => {
    const todosSeleccionados = dispositivos.every((d) => selecciones[d.id]);
    const todosCorrectos = dispositivos.every((d) => selecciones[d.id] === d.tipoCorrecto);

    if (!todosSeleccionados) {
      Alert.alert('🟡 Incompleto', 'Debes clasificar todos los dispositivos.');
      return;
    }

    if (!todosCorrectos) {
      const nuevosFeedback = dispositivos.reduce((acc, d) => {
        const respuesta = selecciones[d.id];
        acc[d.id] = respuesta === d.tipoCorrecto ? 'correcto' : 'incorrecto';
        return acc;
      }, {} as { [key: string]: 'correcto' | 'incorrecto' | null });

      setFeedback(nuevosFeedback);
      Alert.alert('❌ Hay errores', 'Corrige las respuestas incorrectas antes de continuar.');
      return;
    }

    Alert.alert('✅ ¡Completado correctamente!', 'Has clasificado todos los dispositivos correctamente.');
    onSuccess?.();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.title}>🔌 Clasifica por tipo de corriente</Text>
        <Text style={styles.subtitle}>Selecciona el tipo de corriente para cada dispositivo:</Text>

        {dispositivos.map((d) => (
          <View key={d.id} style={styles.card}>
            <Image source={d.imagen} style={styles.image} resizeMode="contain" />
            <Text style={styles.name}>{d.nombre}</Text>

            <View style={styles.options}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selecciones[d.id] === 'DC' && styles.selectedDC,
                ]}
                onPress={() => seleccionar(d.id, 'DC')}
              >
                <Text style={styles.optionText}>Corriente continua</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selecciones[d.id] === 'AC' && styles.selectedAC,
                ]}
                onPress={() => seleccionar(d.id, 'AC')}
              >
                <Text style={styles.optionText}>Corriente alterna</Text>
              </TouchableOpacity>
            </View>

            {feedback[d.id] === 'correcto' && (
              <Text style={styles.correctText}>✅ ¡Correcto!</Text>
            )}
            {feedback[d.id] === 'incorrecto' && (
              <Text style={styles.incorrectText}>
                ❌ Incorrecto. Recuerda que {d.nombre === 'Móvil' || d.nombre === 'Laptop'
                  ? 'los dispositivos portátiles suelen usar corriente continua.'
                  : 'los electrodomésticos grandes como el refrigerador o televisor usan corriente alterna.'}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.checkButton} onPress={verificar}>
        <Text style={styles.buttonText}>Finalizar lección</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  option: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedDC: {
    backgroundColor: '#00C853',
  },
  selectedAC: {
    backgroundColor: '#2962FF',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  correctText: {
    marginTop: 10,
    color: '#00C853',
    fontWeight: 'bold',
  },
  incorrectText: {
    marginTop: 10,
    color: '#D50000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkButton: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

