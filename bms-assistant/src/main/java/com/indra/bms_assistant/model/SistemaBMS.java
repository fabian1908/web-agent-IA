package com.indra.bms_assistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sistemas_bms")
public class SistemaBMS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "protocolo_comunicacion")
    private String protocoloComunicacion;

    private String fabricante;

    @Column(name = "usuario_id")
    private Long usuarioId;

    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Constructores
    public SistemaBMS() {}

    public SistemaBMS(String nombre, String descripcion, String protocoloComunicacion, String fabricante, Long usuarioId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.protocoloComunicacion = protocoloComunicacion;
        this.fabricante = fabricante;
        this.usuarioId = usuarioId;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getProtocoloComunicacion() { return protocoloComunicacion; }
    public void setProtocoloComunicacion(String protocoloComunicacion) { this.protocoloComunicacion = protocoloComunicacion; }

    public String getFabricante() { return fabricante; }
    public void setFabricante(String fabricante) { this.fabricante = fabricante; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}