package com.indra.bms_assistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "metricas_sistema")
public class MetricaSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "documento_id")
    private Long documentoId;

    @Column(name = "tiempo_generacion_segundos")
    private Integer tiempoGeneracionSegundos;

    @Column(name = "errores_detectados")
    private Integer erroresDetectados = 0;

    @Column(name = "observaciones_calidad")
    private Integer observacionesCalidad = 0;

    @Column(name = "satisfaccion_usuario")
    private Integer satisfaccionUsuario;

    @Column(name = "fecha_metricas")
    private LocalDateTime fechaMetricas = LocalDateTime.now();

    // Constructores
    public MetricaSistema() {}

    public MetricaSistema(Long documentoId, Integer tiempoGeneracionSegundos) {
        this.documentoId = documentoId;
        this.tiempoGeneracionSegundos = tiempoGeneracionSegundos;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocumentoId() { return documentoId; }
    public void setDocumentoId(Long documentoId) { this.documentoId = documentoId; }

    public Integer getTiempoGeneracionSegundos() { return tiempoGeneracionSegundos; }
    public void setTiempoGeneracionSegundos(Integer tiempoGeneracionSegundos) { this.tiempoGeneracionSegundos = tiempoGeneracionSegundos; }

    public Integer getErroresDetectados() { return erroresDetectados; }
    public void setErroresDetectados(Integer erroresDetectados) { this.erroresDetectados = erroresDetectados; }

    public Integer getObservacionesCalidad() { return observacionesCalidad; }
    public void setObservacionesCalidad(Integer observacionesCalidad) { this.observacionesCalidad = observacionesCalidad; }

    public Integer getSatisfaccionUsuario() { return satisfaccionUsuario; }
    public void setSatisfaccionUsuario(Integer satisfaccionUsuario) { this.satisfaccionUsuario = satisfaccionUsuario; }

    public LocalDateTime getFechaMetricas() { return fechaMetricas; }
    public void setFechaMetricas(LocalDateTime fechaMetricas) { this.fechaMetricas = fechaMetricas; }
}