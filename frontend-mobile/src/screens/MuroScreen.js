import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MuroScreen({ navigation }) {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([
    {
      id: 1,
      titulo: 'Práctica Profesional A',
      empresa: 'Tech Solutions',
      monto: '$300.000',
      modalidad: 'Híbrido',
      area: 'Software',
      duracion: '3 meses',
      minAvance: 70
    },
    {
      id: 2,
      titulo: 'Práctica Profesional B',
      empresa: 'Banco Estado',
      monto: '$260.000',
      modalidad: 'Remoto',
      area: 'Datos',
      duracion: '2 meses',
      minAvance: 70
    },
    {
      id: 3,
      titulo: 'Práctica Profesional C',
      empresa: 'Latam Airlines',
      monto: 'Por definir',
      modalidad: 'Presencial',
      area: 'Diseño',
      duracion: '2 meses',
      minAvance: 60
    }
  ]);

  const [postuladas, setPostuladas] = useState({});

  useEffect(() => {
    async function loadMuro() {
      try {
        const res = await api.get('/estudiante/muro');
        if (res.data.success && res.data.ofertas.length > 0) {
          setOfertas(res.data.ofertas.map(o => ({
            id: o.id,
            titulo: o.titulo,
            empresa: o.empresa_nombre,
            monto: o.monto_remuneracion || '$250.000',
            modalidad: o.modalidad,
            area: o.area,
            duracion: `${o.duracion_meses || 3} meses`,
            minAvance: o.min_avance_malla
          })));
        }
      } catch (e) {}
    }
    loadMuro();
  }, []);

  const handlePostular = (of) => {
    const miAvance = user?.avanceMalla || 85;
    if (miAvance < of.minAvance) {
      Alert.alert(
        'Requisito no cumplido',
        `Esta práctica exige al menos ${of.minAvance}% de avance curricular (tu avance es ${miAvance}%).`
      );
      return;
    }

    Alert.alert(
      'Confirmar Postulación',
      `¿Deseas enviar tus antecedentes a ${of.empresa} para "${of.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Postular',
          onPress: () => {
            setPostuladas(prev => ({ ...prev, [of.id]: true }));
            Alert.alert('¡Postulación Enviada!', 'Puedes ver el estado en la pestaña Postulaciones.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado Fiel al Mockup Móvil 9.1 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oportunidades Disponibles</Text>
      </View>

      {/* Barra de Filtros en 2 Columnas (Mockup 9.1) */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBox}>
            <Text style={styles.filterText}>📍 Ubicación  ▾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox}>
            <Text style={styles.filterText}>💻 Área  ▾</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBox}>
            <Text style={styles.filterText}>💰 Remuneración  ▾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox}>
            <Text style={styles.filterText}>📅 Fecha  ▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Tarjetas de Práctica */}
      <ScrollView contentContainerStyle={styles.cardsList}>
        {ofertas.map((of) => (
          <View key={of.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{of.titulo}</Text>
                <Text style={styles.cardCompany}>{of.empresa}</Text>
              </View>
              <Text style={styles.cardSalary}>{of.monto}</Text>
            </View>

            {/* Chips de Tags */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{of.modalidad}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{of.area}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{of.duracion}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.postularBtn, postuladas[of.id] && styles.postularBtnDone]}
              onPress={() => handlePostular(of)}
              disabled={postuladas[of.id]}
            >
              <Text style={[styles.postularText, postuladas[of.id] && styles.postularTextDone]}>
                {postuladas[of.id] ? '✓ Ya Postulaste' : 'Postular a Vacante'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    paddingTop: 54,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A'
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8
  },
  filterBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  cardsList: {
    padding: 16,
    gap: 14
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  cardCompany: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2
  },
  cardSalary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534'
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  chipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500'
  },
  postularBtn: {
    backgroundColor: '#0C2340',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  postularBtnDone: {
    backgroundColor: '#DCFCE7'
  },
  postularText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  postularTextDone: {
    color: '#166534'
  }
});
