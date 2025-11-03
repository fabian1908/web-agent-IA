package com.indra.bms_assistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_documentos")
public class HistorialDocumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "documento_id")
    private Long documentoId;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(nullable = false)
    private String accion;

    private String detalles;

    @Column(name = "fecha_accion")
    private LocalDateTime fechaAccion = LocalDateTime.now();

    // Constructores
    public HistorialDocumento() {}

    public HistorialDocumento(Long documentoId, Long usuarioId, String accion, String detalles) {
        this.documentoId = documentoId;
        this.usuarioId = usuarioId;
        this.accion = accion;
        this.detalles = detalles;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocumentoId() { return documentoId; }
    public void setDocumentoId(Long documentoId) { this.documentoId = documentoId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }

    public LocalDateTime getFechaAccion() { return fechaAccion; }
    public void setFechaAccion(LocalDateTime fechaAccion) { this.fechaAccion = fechaAccion; }
}