package com.indra.bms_assistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agentes_ia")
public class AgenteIA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "sistema_id")
    private Long sistemaId;

    @Column(name = "tipo_formato_id")
    private Long tipoFormatoId;

    // CAMBIO IMPORTANTE: Solo String, sin columnDefinition
    private String configuracion;

    @Column(name = "modelo_ia")
    private String modeloIA = "gemini-pro";

    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Constructores
    public AgenteIA() {}

    public AgenteIA(String nombre, String descripcion, Long sistemaId, Long tipoFormatoId, String configuracion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.sistemaId = sistemaId;
        this.tipoFormatoId = tipoFormatoId;
        this.configuracion = configuracion;
    }

    public AgenteIA(String nombre, String descripcion, Long sistemaId, Long tipoFormatoId, String configuracion, String modeloIA) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.sistemaId = sistemaId;
        this.tipoFormatoId = tipoFormatoId;
        this.configuracion = configuracion;
        this.modeloIA = modeloIA;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getSistemaId() {
        return sistemaId;
    }

    public void setSistemaId(Long sistemaId) {
        this.sistemaId = sistemaId;
    }

    public Long getTipoFormatoId() {
        return tipoFormatoId;
    }

    public void setTipoFormatoId(Long tipoFormatoId) {
        this.tipoFormatoId = tipoFormatoId;
    }

    public String getConfiguracion() {
        return configuracion;
    }

    public void setConfiguracion(String configuracion) {
        this.configuracion = configuracion;
    }

    public String getModeloIA() {
        return modeloIA;
    }

    public void setModeloIA(String modeloIA) {
        this.modeloIA = modeloIA;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    // toString para debugging
    @Override
    public String toString() {
        return "AgenteIA{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", sistemaId=" + sistemaId +
                ", tipoFormatoId=" + tipoFormatoId +
                ", configuracion='" + configuracion + '\'' +
                ", modeloIA='" + modeloIA + '\'' +
                ", activo=" + activo +
                ", fechaCreacion=" + fechaCreacion +
                '}';
    }
}