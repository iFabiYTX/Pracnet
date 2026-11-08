import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rut: '',
    universidad: 'Universidad Técnica Federico Santa María',
    carrera: 'Ingeniería Civil Informática',
    ano_ingreso: '2022',
    ubicacion: 'Santiago, Chile',
    terminos: true
  });

  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.password || !form.rut) {
      Alert.alert('Campos Incompletos', 'Por favor llena todos los campos obligatorios.');
      return;
    }
    if (!form.terminos) {
      Alert.alert('Términos', 'Debes aceptar los Términos y Condiciones y Ley N° 19.628.');
      return;
    }

    setLoading(true);
    const res = await register(form);
    setLoading(false);

    if (res.success) {
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente. Ya puedes iniciar sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Error de Registro', res.message || 'No se pudo crear la cuenta.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrarse</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre"
          placeholderTextColor="#94A3B8"
          value={form.nombre}
          onChangeText={(v) => setForm({ ...form, nombre: v })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu apellido"
          placeholderTextColor="#94A3B8"
          value={form.apellido}
          onChangeText={(v) => setForm({ ...form, apellido: v })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu Email"
          placeholderTextColor="#94A3B8"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#94A3B8"
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>RUT</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12.345.678-9"
          placeholderTextColor="#94A3B8"
          value={form.rut}
          onChangeText={(v) => setForm({ ...form, rut: v })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Universidad</Text>
        <TextInput
          style={styles.input}
          value={form.universidad}
          onChangeText={(v) => setForm({ ...form, universidad: v })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Carrera</Text>
        <TextInput
          style={styles.input}
          value={form.carrera}
          onChangeText={(v) => setForm({ ...form, carrera: v })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Año ingreso</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA"
          placeholderTextColor="#94A3B8"
          value={form.ano_ingreso}
          onChangeText={(v) => setForm({ ...form, ano_ingreso: v })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Ubicacion</Text>
        <TextInput
          style={styles.input}
          placeholder="Escriba su ubicacion"
          placeholderTextColor="#94A3B8"
          value={form.ubicacion}
          onChangeText={(v) => setForm({ ...form, ubicacion: v })}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setForm({ ...form, terminos: !form.terminos })}
      >
        <View style={[styles.checkbox, form.terminos && styles.checkboxActive]} />
        <Text style={styles.checkboxText}>
          Acepto Términos y Condiciones y Política de Privacidad (Ley N° 19.628)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backText}>Ya tengo cuenta, Iniciar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24
  },
  field: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4
  },
  input: {
    borderBottomWidth: 1.2,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 6,
    fontSize: 15,
    color: '#0F172A'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8'
  },
  checkboxActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7'
  },
  checkboxText: {
    fontSize: 12,
    color: '#0284C7',
    flex: 1
  },
  button: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B'
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  backText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  }
});
