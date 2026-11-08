import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleAction = (titulo) => {
    Alert.alert(titulo, `Configuración institucional de ${titulo} conforme a la normativa USM.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Superior Oscuro del Mockup Móvil 9.1 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.userName}>{user?.nombre || 'Estudiante X'}</Text>
          <Text style={styles.userCareer}>{user?.carrera || 'Carrera Y'}</Text>
        </View>

        {/* Tarjeta Datos Personales */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Datos personales</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Rut</Text>
              <Text style={styles.infoValue}>{user?.rut || 'XX.XXX.XXX-X'}</Text>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Avanze academico</Text>
              <Text style={styles.infoValue}>9° Semestre</Text>
            </View>
          </View>
        </View>

        {/* Tarjeta Configuración */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Configuracion</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleAction('Cuenta')}
            >
              <Text style={styles.configBtnText}>Cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleAction('Notificaciones')}
            >
              <Text style={styles.configBtnText}>Notificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleAction('Seguridad y privacidad (Ley N° 19.628)')}
            >
              <Text style={styles.configBtnText}>Seguridad y privacidad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.configButton, styles.logoutButton]}
              onPress={logout}
            >
              <Text style={[styles.configBtnText, styles.logoutBtnText]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    paddingBottom: 30
  },
  profileHeader: {
    backgroundColor: '#0C2340',
    paddingTop: 64,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#334155'
  },
  avatarIcon: {
    fontSize: 40
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  userCareer: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoCol: {
    flex: 1
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  },
  buttonsContainer: {
    gap: 12
  },
  configButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  configBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 6
  },
  logoutBtnText: {
    color: '#DC2626'
  }
});
