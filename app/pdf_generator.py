import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Colores institucionales USM
NAVY_USM = colors.HexColor("#0c2340")
BLUE_ACCENT = colors.HexColor("#0284c7")
GOLD_USM = colors.HexColor("#f59e0b")
SLATE_DARK = colors.HexColor("#1e293b")
SLATE_LIGHT = colors.HexColor("#f8fafc")
GREEN_APPROVED = colors.HexColor("#166534")
RED_REJECTED = colors.HexColor("#991b1b")

def generar_formulario_6000b_pdf(output_path: str):
    """Genera el PDF oficial del Formulario 6000 B de la USM."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'USMTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=NAVY_USM,
        alignment=1
    )
    
    subtitle_style = ParagraphStyle(
        'USMSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748b'),
        alignment=1
    )
    
    section_style = ParagraphStyle(
        'USMSection',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=NAVY_USM,
        spaceBefore=8,
        spaceAfter=4
    )
    
    cell_style = ParagraphStyle(
        'USMCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=SLATE_DARK
    )
    
    cell_bold = ParagraphStyle(
        'USMCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=NAVY_USM
    )

    story = []
    
    # Encabezado institucional
    header_data = [
        [
            Paragraph("<b>UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA</b><br/>Dirección General de Docencia • Coordinación Institucional de Prácticas", cell_bold),
            Paragraph("<b>PRACNET USM</b><br/>Folio Regulador: USM-6000B-2026", ParagraphStyle('RightH', parent=cell_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[380, 160])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY_USM, spaceAfter=10))
    
    story.append(Paragraph("FORMULARIO 6000 B", title_style))
    story.append(Paragraph("SOLICITUD Y PAUTA DE EVALUACIÓN DE PRÁCTICA PROFESIONAL", ParagraphStyle('FormSub', parent=title_style, fontSize=11, textColor=BLUE_ACCENT)))
    story.append(Paragraph("Válido conforme al Reglamento General del Estudiante y la Ley N° 16.744 sobre Seguro Escolar", subtitle_style))
    story.append(Spacer(1, 10))
    
    # Sección 1: Antecedentes del Estudiante
    story.append(Paragraph("1. ANTECEDENTES DEL ESTUDIANTE", section_style))
    est_data = [
        [Paragraph("<b>Nombre Completo:</b>", cell_bold), Paragraph("Carlos Mendoza", cell_style), Paragraph("<b>RUT:</b>", cell_bold), Paragraph("20.123.456-7", cell_style)],
        [Paragraph("<b>Carrera:</b>", cell_bold), Paragraph("Ingeniería Civil Informática", cell_style), Paragraph("<b>N° Matrícula / Rol:</b>", cell_bold), Paragraph("202273001-2", cell_style)],
        [Paragraph("<b>Correo Institucional:</b>", cell_bold), Paragraph("alumno@pracnet.cl", cell_style), Paragraph("<b>Nivel / Semestre:</b>", cell_bold), Paragraph("8° Semestre (85% Avance)", cell_style)]
    ]
    t_est = Table(est_data, colWidths=[110, 190, 100, 140])
    t_est.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_est)
    story.append(Spacer(1, 8))
    
    # Sección 2: Antecedentes de la Empresa / Entidad Receptora
    story.append(Paragraph("2. ANTECEDENTES DE LA EMPRESA O ENTIDAD RECEPTORA", section_style))
    emp_data = [
        [Paragraph("<b>Razón Social:</b>", cell_bold), Paragraph("Tech Solutions SpA", cell_style), Paragraph("<b>RUT Empresa:</b>", cell_bold), Paragraph("76.123.456-7", cell_style)],
        [Paragraph("<b>Dirección Centro:</b>", cell_bold), Paragraph("Av. Providencia 1200, Santiago", cell_style), Paragraph("<b>Área Técnica:</b>", cell_bold), Paragraph("Tecnología y Software", cell_style)],
        [Paragraph("<b>Supervisor Directo:</b>", cell_bold), Paragraph("Ing. Tutor Responsable", cell_style), Paragraph("<b>Cargo:</b>", cell_bold), Paragraph("Líder de Desarrollo Backend", cell_style)],
        [Paragraph("<b>Correo Supervisor:</b>", cell_bold), Paragraph("contacto@techsolutions.cl", cell_style), Paragraph("<b>Modalidad:</b>", cell_bold), Paragraph("Híbrida (360 horas cronológicas)", cell_style)]
    ]
    t_emp = Table(emp_data, colWidths=[110, 190, 100, 140])
    t_emp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_emp)
    story.append(Spacer(1, 8))
    
    # Sección 3: Pauta de Evaluación de Competencias
    story.append(Paragraph("3. PAUTA OFICIAL DE EVALUACIÓN DEL TUTOR DE EMPRESA (Escala 1.0 a 7.0)", section_style))
    eval_data = [
        [Paragraph("<b>Criterio de Desempeño Profesional</b>", cell_bold), Paragraph("<b>Ponderación</b>", cell_bold), Paragraph("<b>Nota (1.0 - 7.0)</b>", cell_bold), Paragraph("<b>Observación del Tutor</b>", cell_bold)],
        [Paragraph("1. Aplicación de conocimientos técnicos e ingeniería", cell_style), Paragraph("25%", cell_style), Paragraph("6.8", cell_style), Paragraph("Excelente dominio en microservicios y arquitectura", cell_style)],
        [Paragraph("2. Responsabilidad, cumplimiento de plazos y asistencia", cell_style), Paragraph("25%", cell_style), Paragraph("7.0", cell_style), Paragraph("Puntualidad y compromiso intachable", cell_style)],
        [Paragraph("3. Iniciativa, resolución de problemas y adaptabilidad", cell_style), Paragraph("25%", cell_style), Paragraph("6.5", cell_style), Paragraph("Autonomía destacable frente a requerimientos complejos", cell_style)],
        [Paragraph("4. Trabajo en equipo, relaciones interpersonales y ética", cell_style), Paragraph("25%", cell_style), Paragraph("6.9", cell_style), Paragraph("Óptima integración con el equipo multidisciplinario", cell_style)],
        [Paragraph("<b>NOTA FINAL PONDERADA DE PRÁCTICA:</b>", cell_bold), Paragraph("<b>100%</b>", cell_bold), Paragraph("<b>6.8 (Sobresaliente)</b>", cell_bold), Paragraph("<b>PRÁCTICA APROBADA</b>", cell_bold)]
    ]
    t_eval = Table(eval_data, colWidths=[200, 70, 90, 180])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#dcfce7')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (1,0), (2,-1), 'CENTER')
    ]))
    story.append(t_eval)
    story.append(Spacer(1, 14))
    
    # Sección 4: Firmas y Timbres Reglamentarios
    story.append(Paragraph("4. VALIDACIÓN, TIMBRAJE Y ACREDITACIÓN", section_style))
    signatures_data = [
        [
            Paragraph("<br/><br/>_____________________________________<br/><b>Firma y Timbre Tutor Empresa</b><br/>Tech Solutions SpA", cell_style),
            Paragraph("<br/><br/>_____________________________________<br/><b>Firma del Estudiante</b><br/>Carlos Mendoza", cell_style),
            Paragraph("<br/><br/><b>[ TIMBRE DIGITAL ]</b><br/><b>V°B° Jefatura de Carrera USM</b><br/>Coordinación Académica de Prácticas", cell_style)
        ]
    ]
    t_sig = Table(signatures_data, colWidths=[180, 180, 180])
    t_sig.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#f0f9ff')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8)
    ]))
    story.append(t_sig)
    
    # Pie de página legal
    story.append(Spacer(1, 10))
    legal_text = Paragraph(
        "<i>Documento oficial tramitado a través de PRACNET USM. Certificado bajo la Ley N° 19.799 sobre Documentos Electrónicos y Firma Digital, Decreto Supremo N° 313 (Ley N° 16.744 de Seguro Escolar).</i>",
        subtitle_style
    )
    story.append(legal_text)
    
    doc.build(story)
    return output_path


def generar_expediente_estudiante_pdf(output_path: str, doc_info: dict, estudiante_info: dict):
    """Genera un comprobante formal y certificado PDF del documento de práctica con sello digital."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'ExpTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=NAVY_USM,
        alignment=1
    )
    cell_style = ParagraphStyle('ExpCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=SLATE_DARK)
    cell_bold = ParagraphStyle('ExpBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=NAVY_USM)
    
    story = []
    
    # Header
    header_data = [
        [
            Paragraph("<b>UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA</b><br/>Expediente Digital Institucional de Prácticas Profesionales", cell_bold),
            Paragraph(f"<b>FECHA:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}<br/><b>ESTADO:</b> {doc_info.get('estado_validacion', 'En Revisión')}", ParagraphStyle('RH', parent=cell_style, alignment=2))
        ]
    ]
    t_head = Table(header_data, colWidths=[380, 160])
    story.append(t_head)
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY_USM, spaceAfter=12))
    
    tipo_map = {
        'seguro_escolar': 'Certificado de Seguro Escolar Obligatorio (Ley N° 16.744)',
        'formulario_6000b': 'Formulario 6000 B / Solicitud y Evaluación de Práctica',
        'carta_aceptacion': 'Carta de Aceptación Oficial de la Empresa',
        'informe_final': 'Informe Final de Práctica Profesional',
        'curriculum': 'Curriculum Vitae Institucional'
    }
    nombre_tipo = tipo_map.get(doc_info.get('tipo_documento'), doc_info.get('tipo_documento', 'Documento de Práctica'))
    
    story.append(Paragraph(nombre_tipo.upper(), title_style))
    story.append(Spacer(1, 10))
    
    # Datos de acreditación
    estado = doc_info.get('estado_validacion', 'En Revisión')
    es_aprobado = (estado == 'Aprobado')
    
    datos = [
        [Paragraph("<b>Estudiante:</b>", cell_bold), Paragraph(f"{estudiante_info.get('nombre', '')} {estudiante_info.get('apellido', '')}", cell_style)],
        [Paragraph("<b>RUT:</b>", cell_bold), Paragraph(str(estudiante_info.get('rut', '')), cell_style)],
        [Paragraph("<b>Carrera:</b>", cell_bold), Paragraph(str(estudiante_info.get('carrera', '')), cell_style)],
        [Paragraph("<b>Archivo Cargado:</b>", cell_bold), Paragraph(str(doc_info.get('nombre_archivo', '')), cell_style)],
        [Paragraph("<b>Estado de Validación:</b>", cell_bold), Paragraph(f"<b>{estado}</b>", cell_bold)],
        [Paragraph("<b>Firma Digital:</b>", cell_bold), Paragraph(doc_info.get('firmado_por') or "Pendiente de firma de Jefatura", cell_style)],
        [Paragraph("<b>Fecha de Firma:</b>", cell_bold), Paragraph(str(doc_info.get('fecha_firma') or "En trámite"), cell_style)],
        [Paragraph("<b>Observación Académica:</b>", cell_bold), Paragraph(doc_info.get('observacion') or "Conforme a la normativa curricular vigente.", cell_style)]
    ]
    t_datos = Table(datos, colWidths=[150, 390])
    t_datos.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5)
    ]))
    story.append(t_datos)
    story.append(Spacer(1, 15))
    
    # Sello de Firma Digital Institucional
    if es_aprobado:
        sello_data = [
            [
                Paragraph("<b>CERTIFICADO DE VALIDEZ ELECTRÓNICA — UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA</b><br/>"
                          "Este documento cuenta con Firma Digital de Coordinación Académica. Acredita cumplimiento reglamentario para convalidación curricular en el Sistema de Gestión Académica (SIGA).<br/>"
                          f"<b>Firmante:</b> {doc_info.get('firmado_por', 'Coordinación Académica')} | <b>Fecha:</b> {doc_info.get('fecha_firma', datetime.now().strftime('%Y-%m-%d'))}",
                          ParagraphStyle('Sello', parent=cell_style, textColor=GREEN_APPROVED, fontSize=8, leading=11))
            ]
        ]
        t_sello = Table(sello_data, colWidths=[540])
        t_sello.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
            ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#22c55e')),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12)
        ]))
        story.append(t_sello)
    
    doc.build(story)
    return output_path


def generar_reporte_ejecutivo_pdf(output_path: str, practicas_activas: int, alumnos_habilitados: int, total_postulaciones: int, convenios: int, rows_postulaciones: list):
    """Genera el reporte ejecutivo oficial en PDF para acreditación CNA y Consejo Asesor Empresarial."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'RepTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=NAVY_USM,
        alignment=1
    )
    cell_style = ParagraphStyle('RepCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=9, textColor=SLATE_DARK)
    cell_bold = ParagraphStyle('RepBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=9, textColor=NAVY_USM)
    
    story = []
    
    # Header
    header_data = [
        [
            Paragraph("<b>UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA</b><br/>Dirección de Docencia • Sistema PRACNET USM", cell_bold),
            Paragraph(f"<b>INFORME EJECUTIVO DE PRÁCTICAS</b><br/>Fecha Emisión: {datetime.now().strftime('%d/%m/%Y')}", ParagraphStyle('RH', parent=cell_style, alignment=2))
        ]
    ]
    t_head = Table(header_data, colWidths=[360, 180])
    story.append(t_head)
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY_USM, spaceAfter=10))
    
    story.append(Paragraph("REPORTE OFICIAL DE PRÁCTICAS PROFESIONALES", title_style))
    story.append(Paragraph("Indicadores de Empleabilidad, Cobertura Normativa (Ley 16.744) y Vinculación con el Medio", ParagraphStyle('Sub', parent=title_style, fontSize=9, fontName='Helvetica', textColor=BLUE_ACCENT)))
    story.append(Spacer(1, 10))
    
    # Cuadro de KPIs
    kpi_data = [
        [
            Paragraph("<b>Prácticas Activas</b><br/><font size='12' color='#0c2340'><b>" + str(practicas_activas) + "</b></font>", ParagraphStyle('KPI', parent=cell_style, alignment=1)),
            Paragraph("<b>Alumnos Habilitados</b><br/><font size='12' color='#0284c7'><b>" + str(alumnos_habilitados) + "</b></font>", ParagraphStyle('KPI', parent=cell_style, alignment=1)),
            Paragraph("<b>Postulaciones Totales</b><br/><font size='12' color='#166534'><b>" + str(total_postulaciones) + "</b></font>", ParagraphStyle('KPI', parent=cell_style, alignment=1)),
            Paragraph("<b>Convenios Vigentes</b><br/><font size='12' color='#f59e0b'><b>" + str(convenios) + "</b></font>", ParagraphStyle('KPI', parent=cell_style, alignment=1))
        ]
    ]
    t_kpis = Table(kpi_data, colWidths=[135, 135, 135, 135])
    t_kpis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8)
    ]))
    story.append(t_kpis)
    story.append(Spacer(1, 12))
    
    # Tabla de Postulaciones y Estado
    story.append(Paragraph("<b>NÓMINA DE ESTUDIANTES Y REGISTRO DE CONVALIDACIÓN</b>", cell_bold))
    story.append(Spacer(1, 4))
    
    t_rows = [
        [
            Paragraph("<b>Folio</b>", cell_bold),
            Paragraph("<b>Estudiante</b>", cell_bold),
            Paragraph("<b>Carrera</b>", cell_bold),
            Paragraph("<b>Empresa</b>", cell_bold),
            Paragraph("<b>Cargo</b>", cell_bold),
            Paragraph("<b>Estado / Fase</b>", cell_bold)
        ]
    ]
    
    for r in rows_postulaciones[:18]:  # Limitar para formato de página única
        t_rows.append([
            Paragraph(f"#{r['Folio']}", cell_style),
            Paragraph(str(r['Estudiante']), cell_style),
            Paragraph(str(r['Carrera']), cell_style),
            Paragraph(str(r['Empresa']), cell_style),
            Paragraph(str(r['Cargo']), cell_style),
            Paragraph(f"<b>{r['Fase']}</b>", cell_style)
        ])
        
    t_table = Table(t_rows, colWidths=[35, 105, 110, 100, 100, 90])
    t_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3)
    ]))
    story.append(t_table)
    
    doc.build(story)
    return output_path
