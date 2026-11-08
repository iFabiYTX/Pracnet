import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      Alert.alert('Error', res.message || 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar sesion</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#0C2340" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesion</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Recuperar Clave', 'Se enviará un código de verificación a tu correo institucional.')}
          >
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  content: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 40
  },
  form: {
    width: '100%',
    gap: 18
  },
  inputGroup: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 6
  },
  input: {
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 4
  },
  button: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B'
  },
  linkText: {
    textAlign: 'center',
    color: '#0284C7',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  registerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B'
  }
});
