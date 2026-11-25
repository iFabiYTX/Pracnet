import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ============================================================================
// CARRERAS OFICIALES USM SEDE CONCEPCIÓN (Rey Balduino de Bélgica, Hualpén)
// ============================================================================
export const CARRERAS_USM_CONCEPCION = [
  { nombre: 'Ingeniería en Informática', area: 'Informática & Software', departamento: 'Depto. de Informática y Telecomunicaciones', habilidades: 'Python, SQL, React, Node.js, Git' },
  { nombre: 'Técnico Universitario en Informática', area: 'Informática & Software', departamento: 'Depto. de Informática y Telecomunicaciones', habilidades: 'JavaScript, HTML/CSS, SQL, Soporte TI, Linux' },
  { nombre: 'Técnico Universitario en Telecomunicaciones y Redes', area: 'Telecomunicaciones & Redes', departamento: 'Depto. de Informática y Telecomunicaciones', habilidades: 'Cisco CCNA, Fibra Óptica, Redes IP, Ciberseguridad' },
  { nombre: 'Ingeniería en Electricidad', area: 'Electricidad & Energía', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'Media Tensión, SEC, AutoCAD Electrical, Protecciones' },
  { nombre: 'Técnico Universitario en Electricidad', area: 'Electricidad & Energía', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'Tableros Eléctricos, Normativa RIC, Motores, Mantención' },
  { nombre: 'Técnico Universitario en Electrónica', area: 'Electrónica & Instrumentación', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'Instrumentación Industrial, PCB, Sensores, Microcontroladores' },
  { nombre: 'Ingeniería en Automatización y Control Industrial', area: 'Automatización & Robótica', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'PLC Siemens, SCADA, Control PID, Redes Industriales' },
  { nombre: 'Técnico Universitario en Automatización y Control', area: 'Automatización & Robótica', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'PLC, Variadores de Frecuencia, HMI, Neumática' },
  { nombre: 'Técnico Universitario en Robótica y Mecatrónica', area: 'Automatización & Robótica', departamento: 'Depto. de Electricidad, Electrónica y Automatización', habilidades: 'Robótica Industrial, ROS, CAD/CAM, Actuadores' },
  { nombre: 'Ingeniería en Mantenimiento Industrial', area: 'Mecánica & Mantenimiento', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'TPM, RCM, Análisis de Vibraciones, SAP PM, Confiabilidad' },
  { nombre: 'Ingeniería en Mecánica de Procesos y Mantenimiento Industrial', area: 'Mecánica & Mantenimiento', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'Termodinámica, Equipos Rotativos, Hidráulica, Mantención' },
  { nombre: 'Técnico Universitario en Mecánica Industrial', area: 'Mecánica & Mantenimiento', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'Torno CNC, Soldadura TIG/MIG, Metrología, Hidráulica' },
  { nombre: 'Ingeniería en Mecánica Automotriz y Autotrónica', area: 'Mecánica Automotriz', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'Diagnóstico OBD-II, Electromovilidad, Inyección Electrónica' },
  { nombre: 'Técnico Universitario en Mecánica Automotriz', area: 'Mecánica Automotriz', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'Motores Diésel, Tren Motriz, Scanner Automotriz, Frenos' },
  { nombre: 'Ingeniería en Fabricación y Diseño Industrial', area: 'Diseño & Fabricación', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'SolidWorks, AutoCAD, Impresión 3D, Lean Manufacturing' },
  { nombre: 'Técnico Universitario en Dibujo Técnico Industrial', area: 'Diseño & Fabricación', departamento: 'Depto. de Mecánica y Mantenimiento Industrial', habilidades: 'AutoCAD 2D/3D, Inventor, Planos Estructurales, BIM' },
  { nombre: 'Técnico Universitario en Química (Mención Química Industrial)', area: 'Química & Procesos', departamento: 'Depto. de Química, Medio Ambiente y Minería', habilidades: 'Control de Calidad, Cromatografía, Laboratorio, ISO 9001' },
  { nombre: 'Técnico Universitario en Control del Medio Ambiente', area: 'Medio Ambiente & Sustentabilidad', departamento: 'Depto. de Química, Medio Ambiente y Minería', habilidades: 'ISO 14001, Monitoreo Ambiental, RILES, Gestión de Residuos' },
  { nombre: 'Técnico Universitario en Minería y Metalurgia', area: 'Minería & Metalurgia', departamento: 'Depto. de Química, Medio Ambiente y Minería', habilidades: 'Metalurgia Extractiva, Procesamiento de Minerales, Geología' },
  { nombre: 'Ingeniería en Prevención de Riesgos Laborales y Ambientales', area: 'Prevención de Riesgos', departamento: 'Depto. de Construcción, Prevención y Administración', habilidades: 'Ley 16.744, ISO 45001, Matriz IPER, Higiene Industrial' },
  { nombre: 'Técnico Universitario en Construcción', area: 'Construcción & Obras Civiles', departamento: 'Depto. de Construcción, Prevención y Administración', habilidades: 'Cubicaciones, AutoCAD Civil, Inspección de Obra, Presupuestos' },
  { nombre: 'Técnico Universitario en Administración de Empresas', area: 'Administración & Logística', departamento: 'Depto. de Construcción, Prevención y Administración', habilidades: 'Excel Avanzado, ERP SAP, Finanzas, Logística Portuaria' }
];

// ============================================================================
// CATÁLOGO DE PRÁCTICAS (NO SOLO TECNOLOGÍA — TODAS LAS ÁREAS BIOBÍO / USM)
// ============================================================================
const OFERTAS_SEED = [
  {
    id: 1,
    empresa_nombre: 'ENAP Refinería Biobío',
    empresa_area: 'Química & Procesos',
    area: 'Química & Procesos',
    titulo: 'Práctica Control de Calidad y Laboratorio Petroquímico',
    descripcion: 'Apoyo en análisis fisicoquímicos de combustibles, calibración de equipos de laboratorio y control bajo norma ISO 17025 en Refinería Biobío (Hualpén).',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$340.000',
    cupos: 6,
    habilidades_requeridas: 'Control de Calidad, Cromatografía, Laboratorio, ISO 9001',
    ubicacion: 'Hualpén, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Claudio Araneda',
    correo_supervisor: 'caraneda@enap.cl',
    tasa_retencion: 44
  },
  {
    id: 2,
    empresa_nombre: 'ENAP Refinería Biobío',
    empresa_area: 'Prevención de Riesgos',
    area: 'Prevención de Riesgos',
    titulo: 'Práctica Prevención de Riesgos y Seguridad Industrial',
    descripcion: 'Apoyo en inspecciones de seguridad en planta, actualización de matrices IPER, charlas de 5 minutos y cumplimiento D.S. 594 y Ley 16.744.',
    requisito_academico: 'Min. 75% Malla',
    min_avance_malla: 75,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$320.000',
    cupos: 4,
    habilidades_requeridas: 'Ley 16.744, ISO 45001, Matriz IPER, Higiene Industrial',
    ubicacion: 'Hualpén, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Verónica Bustos',
    correo_supervisor: 'vbustos@enap.cl',
    tasa_retencion: 41
  },
  {
    id: 3,
    empresa_nombre: 'CMPC Celulosa Planta Santa Fe',
    empresa_area: 'Mecánica & Mantenimiento',
    area: 'Mecánica & Mantenimiento',
    titulo: 'Práctica Mantenimiento Predictivo y Confiabilidad',
    descripcion: 'Participación en rutas de análisis de vibraciones, termografía, planificación de mantención en SAP PM y confiabilidad de equipos rotativos.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$350.000',
    cupos: 8,
    habilidades_requeridas: 'TPM, RCM, Análisis de Vibraciones, SAP PM, Confiabilidad',
    ubicacion: 'Nacimiento / Concepción, Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Gonzalo Núñez',
    correo_supervisor: 'gnunez@cmpc.cl',
    tasa_retencion: 46
  },
  {
    id: 4,
    empresa_nombre: 'Celulosa Arauco (Planta Horcones)',
    empresa_area: 'Automatización & Robótica',
    area: 'Automatización & Robótica',
    titulo: 'Práctica Automatización, PLC y Control de Procesos',
    descripcion: 'Apoyo en mantención de lazos de control, programación de PLC Siemens/Rockwell y monitoreo SCADA en línea de producción.',
    requisito_academico: 'Min. 75% Malla',
    min_avance_malla: 75,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$360.000',
    cupos: 6,
    habilidades_requeridas: 'PLC Siemens, SCADA, Control PID, Redes Industriales',
    ubicacion: 'Arauco, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Rodrigo Pizarro',
    correo_supervisor: 'rpizarro@arauco.com',
    tasa_retencion: 48
  },
  {
    id: 5,
    empresa_nombre: 'Siderúrgica Huachipato / CAP Acero',
    empresa_area: 'Minería & Metalurgia',
    area: 'Minería & Metalurgia',
    titulo: 'Práctica Metalurgia de Procesos y Control Siderúrgico',
    descripcion: 'Seguimiento de parámetros metalúrgicos, ensayos mecánicos de acero, análisis de escorias y mejora continua en laminación.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$310.000',
    cupos: 5,
    habilidades_requeridas: 'Metalurgia Extractiva, Procesamiento de Minerales, Geología',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Mauricio Cáceres',
    correo_supervisor: 'mcaceres@cap.cl',
    tasa_retencion: 35
  },
  {
    id: 6,
    empresa_nombre: 'ASMAR Astilleros Talcahuano',
    empresa_area: 'Electrónica & Instrumentación',
    area: 'Electrónica & Instrumentación',
    titulo: 'Práctica Electrónica Naval e Instrumentación',
    descripcion: 'Diagnóstico y calibración de sistemas de navegación, sensores de control de máquinas y tableros electrónicos en dique seco.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$300.000',
    cupos: 5,
    habilidades_requeridas: 'Instrumentación Industrial, PCB, Sensores, Microcontroladores',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Cristián Orellana',
    correo_supervisor: 'corellana@asmar.cl',
    tasa_retencion: 39
  },
  {
    id: 7,
    empresa_nombre: 'ASMAR Astilleros Talcahuano',
    empresa_area: 'Diseño & Fabricación',
    area: 'Diseño & Fabricación',
    titulo: 'Práctica Dibujo Técnico Naval y Diseño CAD 3D',
    descripcion: 'Levantamiento de planos estructurales, modelado 3D en SolidWorks/AutoCAD y cubicación de piezas metálicas para reparación naval.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 180,
    duracion_meses: 2,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$280.000',
    cupos: 4,
    habilidades_requeridas: 'SolidWorks, AutoCAD 2D/3D, Inventor, Planos Estructurales',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Pamela Henríquez',
    correo_supervisor: 'phenriquez@asmar.cl',
    tasa_retencion: 36
  },
  {
    id: 8,
    empresa_nombre: 'Essbio S.A. Biobío',
    empresa_area: 'Medio Ambiente & Sustentabilidad',
    area: 'Medio Ambiente & Sustentabilidad',
    titulo: 'Práctica Control Ambiental y Tratamiento de Aguas',
    descripcion: 'Monitoreo de calidad de agua potable y RILES, seguimiento de RCA y auditorías internas ISO 14001 en plantas de Concepción y San Pedro.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$290.000',
    cupos: 5,
    habilidades_requeridas: 'ISO 14001, Monitoreo Ambiental, RILES, Gestión de Residuos',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Daniela Figueroa',
    correo_supervisor: 'dfigueroa@essbio.cl',
    tasa_retencion: 42
  },
  {
    id: 9,
    empresa_nombre: 'CGE Distribución Biobío',
    empresa_area: 'Electricidad & Energía',
    area: 'Electricidad & Energía',
    titulo: 'Práctica Redes de Distribución y Media Tensión',
    descripcion: 'Apoyo en inspección de líneas de media y baja tensión, coordinación de protecciones, normativa SEC y proyectos de electrificación.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$330.000',
    cupos: 6,
    habilidades_requeridas: 'Media Tensión, SEC, AutoCAD Electrical, Tableros Eléctricos',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Jorge Sandoval',
    correo_supervisor: 'jsandoval@cge.cl',
    tasa_retencion: 45
  },
  {
    id: 10,
    empresa_nombre: 'Constructora Ebco Sur',
    empresa_area: 'Construcción & Obras Civiles',
    area: 'Construcción & Obras Civiles',
    titulo: 'Práctica Control de Obra, Cubicaciones y Terreno',
    descripcion: 'Apoyo a jefatura de terreno en control de avances, cubicaciones de hormigón y enfierradura, estados de pago y calidad constructiva.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$300.000',
    cupos: 6,
    habilidades_requeridas: 'Cubicaciones, AutoCAD Civil, Inspección de Obra, Presupuestos',
    ubicacion: 'San Pedro de la Paz, Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Andrés Maldonado',
    correo_supervisor: 'amaldonado@ebco.cl',
    tasa_retencion: 38
  },
  {
    id: 11,
    empresa_nombre: 'Salazar Israel Automotriz',
    empresa_area: 'Mecánica Automotriz',
    area: 'Mecánica Automotriz',
    titulo: 'Práctica Diagnóstico Electrónico y Autotrónica',
    descripcion: 'Diagnóstico con escáner oficial multimarca, mantención preventiva y correctiva, sistemas híbridos y electromovilidad en taller Concepción.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$270.000',
    cupos: 6,
    habilidades_requeridas: 'Diagnóstico OBD-II, Electromovilidad, Motores Diésel, Scanner Automotriz',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Téc. Sergio Espinoza',
    correo_supervisor: 'sespinoza@salazarisrael.cl',
    tasa_retencion: 40
  },
  {
    id: 12,
    empresa_nombre: 'Derco Center Biobío',
    empresa_area: 'Mecánica Automotriz',
    area: 'Mecánica Automotriz',
    titulo: 'Práctica Taller Mecánico y Servicio Postventa',
    descripcion: 'Mantención de tren motriz, frenos, inyección electrónica y gestión de órdenes de trabajo en servicio técnico oficial.',
    requisito_academico: 'Min. 60% Malla',
    min_avance_malla: 60,
    duracion_horas: 180,
    duracion_meses: 2,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$250.000',
    cupos: 4,
    habilidades_requeridas: 'Motores Diésel, Tren Motriz, Frenos, Inyección Electrónica',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Luis Riquelme',
    correo_supervisor: 'lriquelme@derco.cl',
    tasa_retencion: 34
  },
  {
    id: 13,
    empresa_nombre: 'Puerto Coronel S.A.',
    empresa_area: 'Administración & Logística',
    area: 'Administración & Logística',
    titulo: 'Práctica Gestión Logística y Operaciones Portuarias',
    descripcion: 'Apoyo en control documental de embarques, KPIs de patio de contenedores, análisis en Excel/ERP y coordinación con navieras.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$310.000',
    cupos: 5,
    habilidades_requeridas: 'Excel Avanzado, ERP SAP, Finanzas, Logística Portuaria',
    ubicacion: 'Coronel, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Francisca Paredes',
    correo_supervisor: 'fparedes@puertocoronel.cl',
    tasa_retencion: 43
  },
  {
    id: 14,
    empresa_nombre: 'San Vicente Terminal Internacional (SVTI)',
    empresa_area: 'Prevención de Riesgos',
    area: 'Prevención de Riesgos',
    titulo: 'Práctica Seguridad Portuaria y Prevención de Riesgos',
    descripcion: 'Supervisión de protocolos de seguridad en faenas portuarias, control de EPP, investigación de incidentes y capacitación.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$300.000',
    cupos: 4,
    habilidades_requeridas: 'Ley 16.744, ISO 45001, Matriz IPER, Higiene Industrial',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Eduardo Navarrete',
    correo_supervisor: 'enavarrete@svti.cl',
    tasa_retencion: 37
  },
  {
    id: 15,
    empresa_nombre: 'Tech Solutions Biobío SpA',
    empresa_area: 'Informática & Software',
    area: 'Informática & Software',
    titulo: 'Práctica Desarrollo Fullstack & Cloud',
    descripcion: 'Desarrollo de APIs REST con Node.js/Python, interfaces en React y despliegue en contenedores Docker.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$340.000',
    cupos: 6,
    habilidades_requeridas: 'Python, SQL, React, Node.js, Git',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Ignacio Morales',
    correo_supervisor: 'ignacio.morales@techsolutions.cl',
    tasa_retencion: 47
  },
  {
    id: 16,
    empresa_nombre: 'Banco Estado Regional Biobío',
    empresa_area: 'Informática & Software',
    area: 'Informática & Software',
    titulo: 'Práctica Analista de Datos y Automatización TI',
    descripcion: 'Construcción de tableros de gestión comercial, consultas SQL y automatización de reportes financieros regionales.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$350.000',
    cupos: 5,
    habilidades_requeridas: 'Python, SQL, Excel Avanzado, JavaScript',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Camila Sepúlveda',
    correo_supervisor: 'camila.sepulveda@bancoestado.cl',
    tasa_retencion: 44
  },
  {
    id: 17,
    empresa_nombre: 'Entel Digital Concepción',
    empresa_area: 'Telecomunicaciones & Redes',
    area: 'Telecomunicaciones & Redes',
    titulo: 'Práctica Redes IP, Fibra Óptica y Soporte NOC',
    descripcion: 'Monitoreo de enlaces de fibra óptica, configuración de routers/switches Cisco y soporte de redes empresariales.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$330.000',
    cupos: 5,
    habilidades_requeridas: 'Cisco CCNA, Fibra Óptica, Redes IP, Ciberseguridad',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Felipe Valenzuela',
    correo_supervisor: 'fvalenzuela@entel.cl',
    tasa_retencion: 43
  },
  {
    id: 18,
    empresa_nombre: 'Camanchaca Pesca Sur',
    empresa_area: 'Automatización & Robótica',
    area: 'Automatización & Robótica',
    titulo: 'Práctica Robótica y Automatización Planta Alimentos',
    descripcion: 'Mantención y optimización de líneas automatizadas de empaque, variadores de frecuencia, sensores ópticos y brazos robóticos.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$310.000',
    cupos: 4,
    habilidades_requeridas: 'PLC, Variadores de Frecuencia, Robótica Industrial, Neumática',
    ubicacion: 'Coronel, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Marco Antonio Vera',
    correo_supervisor: 'mvera@camanchaca.cl',
    tasa_retencion: 39
  },
  {
    id: 19,
    empresa_nombre: 'Inchalam S.A.',
    empresa_area: 'Mecánica & Mantenimiento',
    area: 'Mecánica & Mantenimiento',
    titulo: 'Práctica Mecánica Industrial y Maestranza CNC',
    descripcion: 'Apoyo en fabricación de repuestos en torno CNC, metrología industrial, mantenimiento mecánico de trefiladoras y soldadura.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$295.000',
    cupos: 5,
    habilidades_requeridas: 'Torno CNC, Soldadura TIG/MIG, Metrología, Hidráulica',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Hernán Torres',
    correo_supervisor: 'htorres@inchalam.cl',
    tasa_retencion: 41
  },
  {
    id: 20,
    empresa_nombre: 'Masisa Chile (Planta Cabrero)',
    empresa_area: 'Diseño & Fabricación',
    area: 'Diseño & Fabricación',
    titulo: 'Práctica Fabricación Industrial y Mejora Continua',
    descripcion: 'Diseño de dispositivos y utillajes en SolidWorks, aplicación de Lean Manufacturing y reducción de mermas en línea de tableros.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$305.000',
    cupos: 4,
    habilidades_requeridas: 'SolidWorks, AutoCAD, Lean Manufacturing, Impresión 3D',
    ubicacion: 'Cabrero, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Andrea Sáez',
    correo_supervisor: 'asaez@masisa.com',
    tasa_retencion: 36
  },
  {
    id: 21,
    empresa_nombre: 'Moly-Cop Chile S.A.',
    empresa_area: 'Minería & Metalurgia',
    area: 'Minería & Metalurgia',
    titulo: 'Práctica Procesos Metalúrgicos y Tratamientos Térmicos',
    descripcion: 'Control de hornos de tratamiento térmico para bolas de molienda minera, ensayos de dureza y análisis metalográfico.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$335.000',
    cupos: 4,
    habilidades_requeridas: 'Metalurgia Extractiva, Procesamiento de Minerales, Control de Calidad',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Óscar Muñoz',
    correo_supervisor: 'omunoz@molycop.com',
    tasa_retencion: 42
  },
  {
    id: 22,
    empresa_nombre: 'Blumar Seafoods',
    empresa_area: 'Medio Ambiente & Sustentabilidad',
    area: 'Medio Ambiente & Sustentabilidad',
    titulo: 'Práctica Gestión Ambiental y Economía Circular',
    descripcion: 'Trazabilidad de residuos industriales, indicadores de huella de carbono y cumplimiento normativo ambiental en planta Talcahuano.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 180,
    duracion_meses: 2,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$285.000',
    cupos: 3,
    habilidades_requeridas: 'ISO 14001, Gestión de Residuos, Monitoreo Ambiental',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Paula Contreras',
    correo_supervisor: 'pcontreras@blumar.com',
    tasa_retencion: 37
  },
  {
    id: 23,
    empresa_nombre: 'Indura S.A. Concepción',
    empresa_area: 'Química & Procesos',
    area: 'Química & Procesos',
    titulo: 'Práctica Gases Industriales y Control Analítico',
    descripcion: 'Análisis de pureza de gases medicinales e industriales, aseguramiento de calidad y soporte técnico de planta.',
    requisito_academico: 'Min. 70% Malla',
    min_avance_malla: 70,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$300.000',
    cupos: 3,
    habilidades_requeridas: 'Control de Calidad, Laboratorio, ISO 9001, Cromatografía',
    ubicacion: 'Hualpén, Región del Biobío',
    estado: 'Borrador',
    supervisor: 'Ing. Ricardo Araya',
    correo_supervisor: 'raraya@indura.net',
    tasa_retencion: 35
  },
  {
    id: 24,
    empresa_nombre: 'Echeverría Izquierdo Sur',
    empresa_area: 'Construcción & Obras Civiles',
    area: 'Construcción & Obras Civiles',
    titulo: 'Práctica Montaje Industrial y Obras Civiles',
    descripcion: 'Control documental de calidad en obra civil, planos as-built y seguimiento de programación en proyecto industrial del Biobío.',
    requisito_academico: 'Min. 75% Malla',
    min_avance_malla: 75,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$320.000',
    cupos: 4,
    habilidades_requeridas: 'Cubicaciones, Inspección de Obra, AutoCAD Civil, BIM',
    ubicacion: 'Concepción, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Javier Rojas',
    correo_supervisor: 'jrojas@eisa.cl',
    tasa_retencion: 40
  },
  {
    id: 25,
    empresa_nombre: 'Colbún S.A. Central Angostura',
    empresa_area: 'Electricidad & Energía',
    area: 'Electricidad & Energía',
    titulo: 'Práctica Generación Hidroeléctrica y Subestaciones',
    descripcion: 'Mantenimiento preventivo en subestaciones eléctricas, sistemas de excitación y telecontrol de generación.',
    requisito_academico: 'Min. 75% Malla',
    min_avance_malla: 75,
    duracion_horas: 360,
    duracion_meses: 3,
    modalidad: 'Presencial',
    remunerada: 1,
    monto_remuneracion: '$370.000',
    cupos: 4,
    habilidades_requeridas: 'Media Tensión, Protecciones, Normativa RIC, Motores',
    ubicacion: 'Santa Bárbara, Región del Biobío',
    estado: 'Cerrada',
    supervisor: 'Ing. Esteban Ortiz',
    correo_supervisor: 'eortiz@colbun.cl',
    tasa_retencion: 50
  },
  {
    id: 26,
    empresa_nombre: 'Sodimac Logística Biobío',
    empresa_area: 'Administración & Logística',
    area: 'Administración & Logística',
    titulo: 'Práctica Control de Gestión y Abastecimiento',
    descripcion: 'Análisis de inventarios, reportería financiera, control presupuestario y mejora de flujos en centro de distribución.',
    requisito_academico: 'Min. 65% Malla',
    min_avance_malla: 65,
    duracion_horas: 180,
    duracion_meses: 2,
    modalidad: 'Híbrido',
    remunerada: 1,
    monto_remuneracion: '$275.000',
    cupos: 4,
    habilidades_requeridas: 'Excel Avanzado, ERP SAP, Finanzas',
    ubicacion: 'Talcahuano, Región del Biobío',
    estado: 'Activa',
    supervisor: 'Ing. Claudia Escobar',
    correo_supervisor: 'cescobar@sodimac.cl',
    tasa_retencion: 38
  }
];

// ============================================================================
// GENERADOR DETERMINISTA DE NOMBRES Y RUTS CHILENOS VÁLIDOS
// ============================================================================
const NOMBRES = [
  'Matías', 'Valentina', 'Sebastián', 'Sofía', 'Benjamín', 'Martina', 'Vicente', 'Isidora',
  'Martín', 'Florencia', 'Joaquín', 'Maite', 'Agustín', 'Josefa', 'Lucas', 'Amanda',
  'Tomás', 'Antonella', 'Diego', 'Emilia', 'Nicolás', 'Catalina', 'Cristóbal', 'Francisca',
  'Felipe', 'Javiera', 'Ignacio', 'Camila', 'Gabriel', 'Constanza', 'Maximiliano', 'Fernanda',
  'Bastián', 'Antonia', 'Alonso', 'Trinidad', 'Renato', 'Belén', 'Fabián', 'Rocío',
  'Rodrigo', 'Daniela', 'Esteban', 'Paz', 'Claudio', 'Macarena', 'Eduardo', 'Karina',
  'Andrés', 'Paulina'
];

const APELLIDOS = [
  'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva',
  'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres',
  'Araya', 'Flores', 'Espinoza', 'Valenzuela', 'Castillo', 'Tapia', 'Reyes', 'Gutiérrez',
  'Castro', 'Pizarro', 'Álvarez', 'Vásquez', 'Sánchez', 'Fernández', 'Ramírez', 'Carrasco',
  'Gómez', 'Cortés', 'Herrera', 'Núñez', 'Jara', 'Vergara', 'Rivera', 'Figueroa',
  'Riquelme', 'García', 'Miranda', 'Bravo', 'Vera', 'Molina', 'Vega', 'Campos',
  'Sandoval', 'Orellana', 'Alarcón', 'Lagos', 'Bustos', 'Paredes', 'Navarrete', 'Mendoza'
];

function calcularDvRut(numero) {
  let suma = 0;
  let multiplicador = 2;
  let num = numero;
  while (num > 0) {
    suma += (num % 10) * multiplicador;
    num = Math.floor(num / 10);
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

function generarRutChileno(baseNum) {
  const dv = calcularDvRut(baseNum);
  const str = String(baseNum);
  const millones = str.slice(0, str.length - 6);
  const miles = str.slice(str.length - 6, str.length - 3);
  const centenas = str.slice(str.length - 3);
  return `${millones}.${miles}.${centenas}-${dv}`;
}

export function seedPlanBasico() {
  // 1. Preparar ofertas con tokens deterministas
  const ofertas = OFERTAS_SEED.map((o) => ({
    ...o,
    token_acceso: crypto.createHash('sha256').update(`PRACNET-OFERTA-${o.id}-USM`).digest('base64url').slice(0, 22),
    fecha_publicacion: new Date(Date.now() - o.id * 86400000).toISOString()
  }));

  // Indexar ofertas por área para asignar prácticas coherentes con la carrera del alumno
  const ofertasPorArea = {};
  for (const of of ofertas) {
    if (!ofertasPorArea[of.area]) ofertasPorArea[of.area] = [];
    ofertasPorArea[of.area].push(of);
  }

  // 2. Super Administrador + 5 Jefes de Carrera (Tope Plan Básico: 5/5)
  const users = [
    {
      id: 1,
      email: 'admin@pracnetadmin.cl',
      password_hash: 'admin',
      nombre: 'Administrador General PRACNET',
      rol: 'admin',
      rut: '14.444.444-4',
      carrera: 'Administración Central',
      departamento: 'Dirección Central de Administración y Tecnologías USM',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-01T09:00:00.000Z'
    },
    {
      id: 2,
      email: 'jefe1@pracnet.usm.cl',
      password_hash: 'Jefe_USM_2026',
      nombre: 'Dr. Roberto Canales Mendoza',
      rol: 'jefe_carrera',
      rut: generarRutChileno(13450120),
      carrera: 'Ingeniería en Informática / T.U. Informática',
      departamento: 'Depto. de Informática y Telecomunicaciones',
      cargo: 'Jefe de Carrera • Informática y Telecomunicaciones',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-02T09:00:00.000Z'
    },
    {
      id: 3,
      email: 'jefe2@pracnet.usm.cl',
      password_hash: 'Jefe_USM_2026',
      nombre: 'Mg. Carolina Fuentes Aravena',
      rol: 'jefe_carrera',
      rut: generarRutChileno(14820340),
      carrera: 'Mecánica Industrial / Mantenimiento / Automotriz',
      departamento: 'Depto. de Mecánica y Mantenimiento Industrial',
      cargo: 'Jefa de Carrera • Mecánica y Mantenimiento Industrial',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-02T09:15:00.000Z'
    },
    {
      id: 4,
      email: 'jefe3@pracnet.usm.cl',
      password_hash: 'Jefe_USM_2026',
      nombre: 'Ing. Patricio Valdés Riquelme',
      rol: 'jefe_carrera',
      rut: generarRutChileno(12910455),
      carrera: 'Electricidad / Electrónica / Automatización y Robótica',
      departamento: 'Depto. de Electricidad, Electrónica y Automatización',
      cargo: 'Jefe de Carrera • Electricidad y Automatización',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-02T09:30:00.000Z'
    },
    {
      id: 5,
      email: 'jefe4@pracnet.usm.cl',
      password_hash: 'Jefe_USM_2026',
      nombre: 'Dra. Marcela Sepúlveda Cid',
      rol: 'jefe_carrera',
      rut: generarRutChileno(15120890),
      carrera: 'Química Industrial / Medio Ambiente / Minería y Metalurgia',
      departamento: 'Depto. de Química, Medio Ambiente y Minería',
      cargo: 'Jefa de Carrera • Química, Medio Ambiente y Minería',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-02T09:45:00.000Z'
    },
    {
      id: 6,
      email: 'jefe5@pracnet.usm.cl',
      password_hash: 'Jefe_USM_2026',
      nombre: 'Mg. Héctor Lagos Bustamante',
      rol: 'jefe_carrera',
      rut: generarRutChileno(13980210),
      carrera: 'Construcción / Prevención de Riesgos / Administración',
      departamento: 'Depto. de Construcción, Prevención y Administración',
      cargo: 'Jefe de Carrera • Construcción, Prevención y Administración',
      sede: 'Sede Concepción',
      activo: 1,
      creado_en: '2026-08-02T10:00:00.000Z'
    }
  ];

  // 3. Generar exactamente 250 Alumnos (usuario1@pracnet.usm.cl .. usuario250@pracnet.usm.cl)
  // Distribución realista de estados de práctica:
  //   1..65   -> Práctica Finalizada (Convalidada SIGA, con notas 6000 B y Docente, ~40% contratados)
  //   66..125 -> En Práctica Activa (Práctica Iniciada, Seguro Visado, SIGA En Trámite)
  //   126..165 -> En Validación (Pendiente Seguro Escolar / Carta Presentación Emitida)
  //   166..200 -> Postulado / En Selección (Postulado / Entrevista Técnica Realizada / Rechazado)
  //   201..250 -> Sin Práctica (sin oferta asignada aún)
  const postulaciones = [];
  let postulacionIdCounter = 1;

  for (let i = 1; i <= 250; i++) {
    const userId = 6 + i; // 7..256
    const nombre = NOMBRES[(i * 7 + 3) % NOMBRES.length];
    const apellido1 = APELLIDOS[(i * 11 + 5) % APELLIDOS.length];
    const apellido2 = APELLIDOS[(i * 13 + 17) % APELLIDOS.length];
    const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`;
    const rut = generarRutChileno(19500000 + i * 7919);
    const carreraObj = CARRERAS_USM_CONCEPCION[(i - 1) % CARRERAS_USM_CONCEPCION.length];
    const areaOfertas = ofertasPorArea[carreraObj.area] || ofertas;
    const ofertaAsignada = areaOfertas[(i - 1) % areaOfertas.length];

    let estadoPractica = 'Sin Práctica';
    let faseAdministrativa = 'Sin Postulación';
    let estadoPostulacion = null;
    let empresaAsignada = 'Sin práctica asignada';
    let ofertaTitulo = '—';
    let ofertaId = null;
    let supervisorEmpresa = '—';
    let polizaSeguro = 'No emitida';
    let estadoSeguro = 'No requerido aún';
    let convalidacionSIGA = 'Sin Trámite';
    let horasPractica = 0;
    let nota6000B = null;
    let notaDocente = null;
    let promedioFinal = null;
    let resultadoEvaluacion = 'Sin Evaluar';
    let contratado = false;
    let avanceMalla = 62 + ((i * 7) % 35); // 62%..96%
    let semestreActual = Math.min(10, Math.max(4, Math.round(avanceMalla / 10)));

    if (i <= 65) {
      // Práctica Finalizada y Convalidada SIGA
      estadoPractica = 'Práctica Finalizada';
      faseAdministrativa = 'Práctica Finalizada';
      estadoPostulacion = 'Aprobado';
      empresaAsignada = ofertaAsignada.empresa_nombre;
      ofertaTitulo = ofertaAsignada.titulo;
      ofertaId = ofertaAsignada.id;
      supervisorEmpresa = ofertaAsignada.supervisor;
      polizaSeguro = `POL-16744-${String(1000 + i)}`;
      estadoSeguro = 'Visado & Timbrado';
      convalidacionSIGA = 'Convalidado SIGA';
      horasPractica = ofertaAsignada.duracion_horas;
      avanceMalla = 82 + (i % 18);
      semestreActual = avanceMalla >= 90 ? 10 : 9;
      nota6000B = 78 + ((i * 5) % 23); // 78..100
      notaDocente = 76 + ((i * 7) % 24); // 76..99
      promedioFinal = Number(((nota6000B + notaDocente) / 2).toFixed(1));
      resultadoEvaluacion = promedioFinal >= 93 ? 'Sobresaliente' : (promedioFinal >= 85 ? 'Distinción' : 'Aprobado');
      contratado = (i % 5 === 0 || i % 5 === 2); // 40% contratados post-práctica
    } else if (i <= 125) {
      // En Práctica Activa
      estadoPractica = 'En Práctica Activa';
      faseAdministrativa = 'Práctica Iniciada';
      estadoPostulacion = 'Aprobado';
      empresaAsignada = ofertaAsignada.empresa_nombre;
      ofertaTitulo = ofertaAsignada.titulo;
      ofertaId = ofertaAsignada.id;
      supervisorEmpresa = ofertaAsignada.supervisor;
      polizaSeguro = `POL-16744-${String(1000 + i)}`;
      estadoSeguro = 'Visado & Timbrado';
      convalidacionSIGA = 'En Trámite';
      horasPractica = ofertaAsignada.duracion_horas;
      avanceMalla = 74 + (i % 18);
      semestreActual = avanceMalla >= 84 ? 8 : 7;
      resultadoEvaluacion = 'En Curso';
    } else if (i <= 165) {
      // En Validación Administrativa (Seguro Escolar / Carta Presentación)
      const esCarta = i % 2 === 0;
      estadoPractica = 'En Validación';
      faseAdministrativa = esCarta ? 'Carta Presentación Emitida' : 'Pendiente Seguro Escolar';
      estadoPostulacion = 'Validación Académica';
      empresaAsignada = ofertaAsignada.empresa_nombre;
      ofertaTitulo = ofertaAsignada.titulo;
      ofertaId = ofertaAsignada.id;
      supervisorEmpresa = ofertaAsignada.supervisor;
      polizaSeguro = esCarta ? `POL-16744-${String(1000 + i)}` : 'En Emisión';
      estadoSeguro = esCarta ? 'En Revisión' : 'Pendiente Visado';
      convalidacionSIGA = 'Pendiente';
      horasPractica = ofertaAsignada.duracion_horas;
      avanceMalla = 70 + (i % 16);
      semestreActual = 7;
      resultadoEvaluacion = 'Pendiente';
    } else if (i <= 200) {
      // Postulado / En Selección / algunos Rechazados
      const esRechazado = i > 190;
      const esEntrevista = !esRechazado && i % 2 === 0;
      estadoPractica = esRechazado ? 'Postulación Rechazada' : (esEntrevista ? 'En Selección' : 'Postulado');
      faseAdministrativa = esRechazado
        ? 'Postulación Desestimada'
        : (esEntrevista ? 'Entrevista Técnica Realizada' : 'Postulado');
      estadoPostulacion = esRechazado ? 'Rechazado' : (esEntrevista ? 'En Selección' : 'Postulado');
      empresaAsignada = ofertaAsignada.empresa_nombre;
      ofertaTitulo = ofertaAsignada.titulo;
      ofertaId = ofertaAsignada.id;
      supervisorEmpresa = ofertaAsignada.supervisor;
      polizaSeguro = 'No emitida';
      estadoSeguro = 'Sin Seguro (Postulación)';
      convalidacionSIGA = 'Pendiente';
      horasPractica = ofertaAsignada.duracion_horas;
      avanceMalla = 68 + (i % 15);
      semestreActual = 6;
      resultadoEvaluacion = esRechazado ? 'Rechazada' : 'Pendiente';
    } else {
      // Sin Práctica (50 estudiantes)
      estadoPractica = 'Sin Práctica';
      avanceMalla = 48 + (i % 34); // Algunos aún bajo 70%, otros habilitados buscando
      semestreActual = avanceMalla >= 70 ? 7 : 5;
      resultadoEvaluacion = 'Sin Práctica';
    }

    const createdAt = new Date(Date.UTC(2026, 8, 1 + (i % 28), 10 + (i % 8), (i * 3) % 60)).toISOString();

    users.push({
      id: userId,
      email: `usuario${i}@pracnet.usm.cl`,
      password_hash: 'PracNet_2026',
      nombre: nombreCompleto,
      rol: 'estudiante',
      rut,
      carrera: carreraObj.nombre,
      area: carreraObj.area,
      departamento: carreraObj.departamento,
      sede: 'Sede Concepción',
      universidad: 'Universidad Técnica Federico Santa María',
      avance_malla: avanceMalla,
      semestre_actual: semestreActual,
      habilidades: carreraObj.habilidades,
      estado_practica: estadoPractica,
      fase_administrativa: faseAdministrativa,
      empresa_asignada: empresaAsignada,
      oferta_id: ofertaId,
      oferta_titulo: ofertaTitulo,
      supervisor_empresa: supervisorEmpresa,
      poliza_seguro: polizaSeguro,
      estado_seguro: estadoSeguro,
      convalidacion_siga: convalidacionSIGA,
      horas_practica: horasPractica,
      nota_6000b: nota6000B,
      nota_docente: notaDocente,
      promedio_final: promedioFinal,
      resultado_evaluacion: resultadoEvaluacion,
      contratado,
      activo: 1,
      creado_en: createdAt
    });

    if (ofertaId !== null) {
      postulaciones.push({
        id: postulacionIdCounter++,
        estudiante_id: userId,
        estudiante_nombre: nombreCompleto,
        estudiante_email: `usuario${i}@pracnet.usm.cl`,
        estudiante_rut: rut,
        carrera: carreraObj.nombre,
        area: carreraObj.area,
        avance_malla: avanceMalla,
        oferta_practica_id: ofertaId,
        oferta_titulo: ofertaTitulo,
        empresa_nombre: empresaAsignada,
        duracion_horas: horasPractica,
        estado: estadoPostulacion,
        estado_practica: estadoPractica,
        fase_administrativa: faseAdministrativa,
        nota_evaluacion: promedioFinal,
        fecha_postulacion: createdAt
      });
    }
  }

  // 4. Tokens de Empresa (Empresas reales de la Región del Biobío)
  const companyTokens = [
    {
      id: 'TOK-1001',
      empresa: 'ENAP Refinería Biobío',
      rut_empresa: '92.604.000-6',
      supervisor: 'Ing. Claudio Araneda',
      correo_supervisor: 'caraneda@enap.cl',
      token: 'PRAC-TK-1001-ENAP-BIOBIO',
      proposito: 'Supervisión Laboratorio Químico & Firma Formulario 6000 B',
      estudiante: 'Alumnos Química y Prevención USM Concepción',
      estado: 'Activo',
      fecha_emision: '2026-10-15T10:00:00.000Z',
      fecha_expiracion: '2027-01-30T23:59:59.000Z',
      usos_registrados: 12
    },
    {
      id: 'TOK-1002',
      empresa: 'CMPC Celulosa Planta Santa Fe',
      rut_empresa: '90.221.000-8',
      supervisor: 'Ing. Gonzalo Núñez',
      correo_supervisor: 'gnunez@cmpc.cl',
      token: 'PRAC-TK-1002-CMPC-SANTAFE',
      proposito: 'Mantenimiento Predictivo & Validación Seguro Ley 16.744',
      estudiante: 'Alumnos Mecánica y Mantenimiento Industrial',
      estado: 'Activo',
      fecha_emision: '2026-10-18T09:30:00.000Z',
      fecha_expiracion: '2027-02-15T23:59:59.000Z',
      usos_registrados: 15
    },
    {
      id: 'TOK-1003',
      empresa: 'Celulosa Arauco (Planta Horcones)',
      rut_empresa: '93.458.000-1',
      supervisor: 'Ing. Rodrigo Pizarro',
      correo_supervisor: 'rpizarro@arauco.com',
      token: 'PRAC-TK-1003-ARAUCO-PLC',
      proposito: 'Supervisión Automatización, PLC & Evaluación 6000 B',
      estudiante: 'Alumnos Automatización y Robótica USM',
      estado: 'Activo',
      fecha_emision: '2026-10-20T14:00:00.000Z',
      fecha_expiracion: '2027-02-20T23:59:59.000Z',
      usos_registrados: 9
    },
    {
      id: 'TOK-1004',
      empresa: 'ASMAR Astilleros Talcahuano',
      rut_empresa: '61.102.000-5',
      supervisor: 'Ing. Cristián Orellana',
      correo_supervisor: 'corellana@asmar.cl',
      token: 'PRAC-TK-1004-ASMAR-THNO',
      proposito: 'Instrumentación Naval, Electrónica y Dibujo Técnico',
      estudiante: 'Alumnos Electrónica y Diseño Industrial',
      estado: 'Activo',
      fecha_emision: '2026-10-22T11:15:00.000Z',
      fecha_expiracion: '2027-01-25T23:59:59.000Z',
      usos_registrados: 7
    },
    {
      id: 'TOK-1005',
      empresa: 'Essbio S.A. Biobío',
      rut_empresa: '76.833.300-9',
      supervisor: 'Ing. Daniela Figueroa',
      correo_supervisor: 'dfigueroa@essbio.cl',
      token: 'PRAC-TK-1005-ESSBIO-AMB',
      proposito: 'Control Ambiental, RILES & Validación Formulario 6000 B',
      estudiante: 'Alumnos Medio Ambiente USM Concepción',
      estado: 'Activo',
      fecha_emision: '2026-10-25T08:45:00.000Z',
      fecha_expiracion: '2027-01-20T23:59:59.000Z',
      usos_registrados: 6
    },
    {
      id: 'TOK-1006',
      empresa: 'CGE Distribución Biobío',
      rut_empresa: '76.411.321-7',
      supervisor: 'Ing. Jorge Sandoval',
      correo_supervisor: 'jsandoval@cge.cl',
      token: 'PRAC-TK-1006-CGE-BIOBIO',
      proposito: 'Supervisión Prácticas Electricidad y Media Tensión',
      estudiante: 'Alumnos Electricidad USM Concepción',
      estado: 'Activo',
      fecha_emision: '2026-10-28T16:00:00.000Z',
      fecha_expiracion: '2027-02-28T23:59:59.000Z',
      usos_registrados: 8
    },
    {
      id: 'TOK-1007',
      empresa: 'Tech Solutions Biobío SpA',
      rut_empresa: '76.892.110-4',
      supervisor: 'Ing. Ignacio Morales',
      correo_supervisor: 'ignacio.morales@techsolutions.cl',
      token: 'PRAC-TK-1007-TECH-CONCE',
      proposito: 'Supervisión Desarrollo Fullstack & Firma Digital 6000 B',
      estudiante: 'Alumnos Informática USM Concepción',
      estado: 'Activo',
      fecha_emision: '2026-11-01T10:00:00.000Z',
      fecha_expiracion: '2027-01-30T23:59:59.000Z',
      usos_registrados: 11
    },
    {
      id: 'TOK-1008',
      empresa: 'Colbún S.A. Central Angostura',
      rut_empresa: '96.505.760-9',
      supervisor: 'Ing. Esteban Ortiz',
      correo_supervisor: 'eortiz@colbun.cl',
      token: 'PRAC-TK-1008-COLBUN-VENC',
      proposito: 'Práctica Generación Hidroeléctrica (Periodo Anterior)',
      estudiante: 'Alumnos Egresados 2026-1',
      estado: 'Expirado',
      fecha_emision: '2026-07-01T08:00:00.000Z',
      fecha_expiracion: '2026-10-15T23:59:59.000Z',
      usos_registrados: 4
    }
  ];

  // Guardar archivos limpios en backend/data/
  fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATA_DIR, 'ofertas.json'), JSON.stringify(ofertas, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATA_DIR, 'postulaciones.json'), JSON.stringify(postulaciones, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATA_DIR, 'company_tokens.json'), JSON.stringify(companyTokens, null, 2), 'utf-8');

  return {
    totalUsuarios: users.length,
    admins: users.filter(u => u.rol === 'admin').length,
    jefesCarrera: users.filter(u => u.rol === 'jefe_carrera').length,
    alumnos: users.filter(u => u.rol === 'estudiante').length,
    ofertas: ofertas.length,
    postulaciones: postulaciones.length,
    tokens: companyTokens.length
  };
}

// Ejecutar directamente si se invoca por CLI: node backend/src/utils/seedPlanBasico.js
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const resumen = seedPlanBasico();
  console.log('>> [PRACNET Plan Básico] Base de datos limpiada y poblada con éxito:');
  console.log(JSON.stringify(resumen, null, 2));
}
