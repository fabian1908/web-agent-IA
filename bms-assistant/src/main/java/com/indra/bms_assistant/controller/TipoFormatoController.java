package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.TipoFormato;
import com.indra.bms_assistant.service.TipoFormatoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/formatos")
public class TipoFormatoController {

    private final TipoFormatoService tipoFormatoService;

    public TipoFormatoController(TipoFormatoService tipoFormatoService) {
        this.tipoFormatoService = tipoFormatoService;
    }

    @GetMapping
    public List<TipoFormato> obtenerTodosLosFormatos() {
        return tipoFormatoService.getAllFormatos();
    }

    @GetMapping("/activos")
    public List<TipoFormato> obtenerFormatosActivos() {
        return tipoFormatoService.getFormatosActivos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoFormato> obtenerFormatoPorId(@PathVariable Long id) {
        Optional<TipoFormato> formato = tipoFormatoService.getFormatoById(id);
        return formato.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<TipoFormato> obtenerFormatoPorCodigo(@PathVariable String codigo) {
        Optional<TipoFormato> formato = tipoFormatoService.getFormatoByCodigo(codigo);
        return formato.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TipoFormato crearFormato(@RequestBody TipoFormato formato) {
        return tipoFormatoService.crearFormato(formato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoFormato> actualizarFormato(@PathVariable Long id, @RequestBody TipoFormato formato) {
        TipoFormato formatoActualizado = tipoFormatoService.actualizarFormato(id, formato);
        if (formatoActualizado != null) {
            return ResponseEntity.ok(formatoActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarFormato(@PathVariable Long id) {
        tipoFormatoService.desactivarFormato(id);
        return ResponseEntity.ok().build();
    }
}