import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsistenteAiModal from '../components/AsistenteAiModal';

export default function ValidacionScreen() {
  const [progreso] = useState(65); // 65% Exacto del Mockup Móvil 9.1
  const [modalAiVisible, setModalAiVisible] = useState(false);

  const checklistItems = [
    { label: 'Inscripción de Práctica', checked: true },
    { label: 'Seguro Escolar', checked: true },
    { label: 'Validación de Horas', checked: false },
    { label: 'Informe Final', checked: false }
  ];

  const handleUploadDoc = (docType) => {
    Alert.alert(
      'Cargar Documento',
      `Selecciona tu archivo PDF o DOCX para: ${docType}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Seleccionar Archivo',
          onPress: () => Alert.alert('¡Documento Cargado!', 'El archivo ha sido enviado a revisión por tu Jefatura.')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado y Barra de Validación (Mockup 9.1) */}
        <View style={styles.header}>
          <Text style={styles.title}>Validacion de la practica</Text>
          
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progreso}%` }]} />
          </View>
          <Text style={styles.progressText}>Tu proceso de validación está al {progreso}%</Text>
        </View>

        {/* Guía Paso a Paso */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Guia paso a paso</Text>
          <View style={styles.checklist}>
            {checklistItems.map((item, idx) => (
              <View key={idx} style={styles.checkRow}>
                <View style={[styles.checkCircle, item.checked && styles.checkCircleActive]}>
                  {item.checked && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                <Text style={[styles.checkLabel, item.checked && styles.checkLabelActive]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sección Documentos y Botón Asistente AI */}
        <View style={styles.sectionCard}>
          <View style={styles.docsHeader}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => setModalAiVisible(true)}
            >
              <Text style={styles.aiButtonText}>🤖 Asistente AI</Text>
            </TouchableOpacity>
          </View>

          {/* Cards de Documentos del Mockup 9.1 */}
          <View style={styles.docList}>
            {/* Doc 1: CV */}
            <View style={styles.docCard}>
              <View style={styles.docInfo}>
                <View style={[styles.docBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.docBadgeText, { color: '#DC2626' }]}>PDF</Text>
                </View>
                <View>
                  <Text style={styles.docName}>Curriculum_Vitae.pdf</Text>
                  <Text style={styles.docStatusGreen}>Subido</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Curriculum Vitae', 'Visualizando archivo validado.')}>
                <Text style={styles.viewAction}>Ver</Text>
              </TouchableOpacity>
            </View>

            {/* Doc 2: Seguro Escolar */}
            <View style={styles.docCard}>
              <View style={styles.docInfo}>
                <View style={[styles.docBadge, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.docBadgeText, { color: '#0284C7' }]}>PDF</Text>
                </View>
                <View>
                  <Text style={styles.docName}>Seguro_Escolar_2026.pdf</Text>
                  <Text style={styles.docStatusGreen}>Subido</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Seguro Escolar', 'Certificado Ley N° 16.744 vigente.')}>
                <Text style={styles.viewAction}>Ver</Text>
              </TouchableOpacity>
            </View>

            {/* Doc 3: Informe Final */}
            <View style={styles.docCard}>
              <View style={styles.docInfo}>
                <View style={[styles.docBadge, { backgroundColor: '#F1F5F9' }]}>
                  <Text style={[styles.docBadgeText, { color: '#64748B' }]}>DOC</Text>
                </View>
                <View>
                  <Text style={styles.docName}>Informe_Final_Practica</Text>
                  <Text style={styles.docStatusMuted}>No se ha subido archivo</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleUploadDoc('Informe Final y Formulario 6000 B')}>
                <Text style={styles.uploadAction}>+ Subir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Interactivo del Asistente AI */}
      <AsistenteAiModal
        visible={modalAiVisible}
        onClose={() => setModalAiVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 20,
    paddingTop: 54,
    gap: 18
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 8
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14
  },
  checklist: {
    gap: 14
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkCircleActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B'
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold'
  },
  checkLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500'
  },
  checkLabelActive: {
    color: '#0F172A',
    fontWeight: '600'
  },
  docsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  aiButton: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7'
  },
  docList: {
    gap: 10
  },
  docCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  docBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  docBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B'
  },
  docStatusGreen: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 2
  },
  docStatusMuted: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  viewAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7'
  },
  uploadAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7'
  }
});
