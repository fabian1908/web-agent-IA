package com.indra.bms_assistant.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tipos_formato")
public class TipoFormato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo; // N1, N2, N3

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String plantilla;

    private Boolean activo = true;

    // Constructores
    public TipoFormato() {}

    public TipoFormato(String codigo, String nombre, String descripcion) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getPlantilla() { return plantilla; }
    public void setPlantilla(String plantilla) { this.plantilla = plantilla; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}