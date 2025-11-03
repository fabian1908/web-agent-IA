-- Tabla de usuarios del sistema
CREATE TABLE usuarios (
                          id SERIAL PRIMARY KEY,
                          email VARCHAR(255) UNIQUE NOT NULL,
                          password_hash VARCHAR(255) NOT NULL,
                          nombre VARCHAR(100) NOT NULL,
                          apellido VARCHAR(100) NOT NULL,
                          rol VARCHAR(50) NOT NULL CHECK (rol IN ('SUPERVISOR', 'ADMIN', 'PRACTICANTE')),
                          empresa VARCHAR(100) NOT NULL,
                          especialidad VARCHAR(100),
                          activo BOOLEAN DEFAULT TRUE,
                          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sistemas BMS (HVAC, Eléctricos, Ascensores, etc.)
CREATE TABLE sistemas_bms (
                              id SERIAL PRIMARY KEY,
                              nombre VARCHAR(100) NOT NULL,
                              descripcion TEXT,
                              protocolo_comunicacion VARCHAR(50),
                              fabricante VARCHAR(100),
                              usuario_id INTEGER REFERENCES usuarios(id),
                              activo BOOLEAN DEFAULT TRUE,
                              fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de formato/documento
CREATE TABLE tipos_formato (
                               id SERIAL PRIMARY KEY,
                               codigo VARCHAR(10) NOT NULL UNIQUE, -- N1, N2, N3, etc.
                               nombre VARCHAR(100) NOT NULL,
                               descripcion TEXT,
                               plantilla TEXT, -- Estructura base del documento
                               campos_requeridos JSONB, -- Campos que necesita la IA
                               activo BOOLEAN DEFAULT TRUE
);

-- Tabla de agentes IA especializados
CREATE TABLE agentes_ia (
                            id SERIAL PRIMARY KEY,
                            nombre VARCHAR(100) NOT NULL,
                            descripcion TEXT,
                            sistema_id INTEGER REFERENCES sistemas_bms(id),
                            tipo_formato_id INTEGER REFERENCES tipos_formato(id),
                            configuracion JSONB, -- Parámetros específicos del agente
                            modelo_ia VARCHAR(50) DEFAULT 'gemini-pro',
                            activo BOOLEAN DEFAULT TRUE,
                            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de documentos generados
CREATE TABLE documentos (
                            id SERIAL PRIMARY KEY,
                            titulo VARCHAR(255) NOT NULL,
                            contenido TEXT NOT NULL,
                            tipo_formato_id INTEGER REFERENCES tipos_formato(id),
                            sistema_id INTEGER REFERENCES sistemas_bms(id),
                            agente_id INTEGER REFERENCES agentes_ia(id),
                            usuario_id INTEGER REFERENCES usuarios(id),
                            estado VARCHAR(50) DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'REVISION', 'APROBADO', 'RECHAZADO')),
                            version INTEGER DEFAULT 1,
                            observaciones TEXT,
                            calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
                            metadata JSONB, -- Información adicional del documento
                            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de generación de documentos
CREATE TABLE historial_documentos (
                                      id SERIAL PRIMARY KEY,
                                      documento_id INTEGER REFERENCES documentos(id),
                                      usuario_id INTEGER REFERENCES usuarios(id),
                                      accion VARCHAR(50) NOT NULL,
                                      detalles TEXT,
                                      fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas y seguimiento (para indicadores de éxito)
CREATE TABLE metricas_sistema (
                                  id SERIAL PRIMARY KEY,
                                  documento_id INTEGER REFERENCES documentos(id),
                                  tiempo_generacion_segundos INTEGER, -- Tiempo que tomó generar vs manual
                                  errores_detectados INTEGER DEFAULT 0,
                                  observaciones_calidad INTEGER DEFAULT 0,
                                  satisfaccion_usuario INTEGER CHECK (satisfaccion_usuario >= 1 AND satisfaccion_usuario <= 5),
                                  fecha_metricas TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
INSERT INTO tipos_formato (codigo, nombre, descripcion, campos_requeridos) VALUES
                                                                               ('N1', 'Formato de Comisionamiento', 'Documentación de actividades de comisionamiento del sistema', '["equipos", "configuraciones", "pruebas_realizadas", "resultados"]'),
                                                                               ('N2', 'Reporte de Pruebas', 'Reporte técnico de pruebas realizadas al sistema', '["protocolo_prueba", "equipos_involucrados", "metricas", "observaciones"]'),
                                                                               ('N3', 'Documentación Técnica', 'Documentación técnica del sistema integrado', '["especificaciones", "diagramas", "configuraciones", "protocolos"]');

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, empresa, especialidad) VALUES
                                                                                              ('admin@indra.com', 'hashed_password', 'Admin', 'Sistema', 'ADMIN', 'INDRA', 'Sistemas'),
                                                                                              ('supervisor@indra.com', 'hashed_password', 'Carlos', 'Supervisor', 'SUPERVISOR', 'INDRA', 'HVAC'),
                                                                                              ('practicante@indra.com', 'hashed_password', 'Ana', 'Practicante', 'PRACTICANTE', 'INDRA', 'Eléctricos');

-- Crear índices para mejor performance
CREATE INDEX idx_documentos_usuario ON documentos(usuario_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_formato_id);
CREATE INDEX idx_documentos_sistema ON documentos(sistema_id);
CREATE INDEX idx_agentes_sistema ON agentes_ia(sistema_id);
CREATE INDEX idx_historial_documento ON historial_documentos(documento_id);