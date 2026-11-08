import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import api from '../api/client';

export default function AsistenteAiModal({ visible, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy el Asistente Virtual de PRACNET USM. Puedo ayudarte con dudas sobre convalidación en SIGA, el Seguro Escolar (Ley N° 16.744), el Formulario 6000 B o la normativa laboral.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (customQuery) => {
    const query = customQuery || inputText;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await api.post('/estudiante/asistente-ai', { pregunta: query });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.respuesta }]);
    } catch (e) {
      // Fallback local normativo
      let resp = 'El proceso de práctica se tramita mediante la Carta de Presentación, Seguro Escolar Ley N° 16.744 y el Formulario 6000 B firmado por tu tutor laboral.';
      if (query.toLowerCase().includes('seguro')) {
        resp = 'El Seguro Escolar (Ley N° 16.744 y D.S. N° 313) cubre accidentes en el centro laboral o en el trayecto. Es obligatorio tener cargado tu certificado antes de iniciar.';
      } else if (query.toLowerCase().includes('siga')) {
        resp = 'Una vez finalizadas tus horas y firmado el Formulario 6000 B por tu supervisor, la Jefatura convalidará tu calificación en SIGA.';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: resp }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    '¿Cómo funciona el Seguro Escolar?',
    '¿Qué es el Formulario 6000 B?',
    '¿Cuánto es la remuneración legal?',
    '¿Cómo convalidar en SIGA?'
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header del Modal - Mockup Móvil 9.1 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Asistente AI</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Mensajes */}
          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.msgBubble,
                  m.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    m.sender === 'user' ? styles.userText : styles.botText
                  ]}
                >
                  {m.text}
                </Text>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.msgBubble, styles.botBubble]}>
                <ActivityIndicator size="small" color="#0C2340" />
              </View>
            )}
          </ScrollView>

          {/* Preguntas Frecuentes Rápidas */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBar}>
            {quickQuestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => handleSend(q)}
              >
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input de Consulta - Mockup 9.1 */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="¿En qué puedo ayudarte?"
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#0C2340',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16
  },
  chatContent: {
    paddingVertical: 14,
    gap: 10
  },
  msgBubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0C2340'
  },
  botText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18
  },
  userText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18
  },
  quickBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 46
  },
  quickChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8
  },
  quickText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7'
  },
  inputBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A'
  },
  sendBtn: {
    backgroundColor: '#0C2340',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
