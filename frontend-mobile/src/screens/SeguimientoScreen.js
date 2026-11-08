import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';

export default function SeguimientoScreen() {
  const steps = [
    { title: 'Postulado', state: 'done', desc: 'Antecedentes recepcionados correctamente.' },
    { title: 'En Seleccion', state: 'done', desc: 'Pre-seleccionado para entrevista con Tech Solutions.' },
    { title: 'Validacion academica', state: 'active', desc: 'Revisión de horas y Seguro Escolar por Jefatura USM.' },
    { title: 'Aprobado', state: 'pending', desc: 'Ingreso final de calificación en plataforma SIGA.' }
  ];

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seguimiento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Principal de Postulación en Curso (Mockup 9.1) */}
        <View style={styles.mainCard}>
          <Text style={styles.badgeText}>POSTULACIÓN EN CURSO</Text>
          <Text style={styles.practiceTitle}>Práctica Profesional A</Text>
          <Text style={styles.companySub}>Empresa 1 • Lab. de Innovación</Text>

          {/* Stepper Vertical */}
          <View style={styles.stepperContainer}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                {/* Indicador visual y línea conectora */}
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.circle,
                      step.state === 'done' && styles.circleDone,
                      step.state === 'active' && styles.circleActive,
                      step.state === 'pending' && styles.circlePending
                    ]}
                  />
                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.connectorLine,
                        step.state === 'done' ? styles.lineDone : styles.linePending
                      ]}
                    />
                  )}
                </View>

                {/* Texto del paso */}
                <View style={styles.stepTextCol}>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.state === 'active' && styles.stepTitleActive,
                      step.state === 'done' && styles.stepTitleDone
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
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
  content: {
    padding: 20
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  practiceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },
  companySub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 26
  },
  stepperContainer: {
    paddingLeft: 6
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 64
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7
  },
  circleDone: {
    backgroundColor: '#10B981'
  },
  circleActive: {
    backgroundColor: '#0284C7',
    borderWidth: 3,
    borderColor: '#BAE6FD',
    width: 18,
    height: 18,
    borderRadius: 9
  },
  circlePending: {
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#CBD5E1'
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4
  },
  lineDone: {
    backgroundColor: '#10B981'
  },
  linePending: {
    backgroundColor: '#E2E8F0'
  },
  stepTextCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B'
  },
  stepTitleDone: {
    color: '#0F172A'
  },
  stepTitleActive: {
    color: '#0284C7',
    fontWeight: '800'
  },
  stepDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  }
});
