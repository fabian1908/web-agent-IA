package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.HistorialDocumento;
import com.indra.bms_assistant.service.HistorialDocumentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
public class HistorialDocumentoController {

    private final HistorialDocumentoService historialDocumentoService;

    public HistorialDocumentoController(HistorialDocumentoService historialDocumentoService) {
        this.historialDocumentoService = historialDocumentoService;
    }

    @GetMapping
    public List<HistorialDocumento> obtenerTodoElHistorial() {
        return historialDocumentoService.getAllHistorial();
    }

    @GetMapping("/documento/{documentoId}")
    public List<HistorialDocumento> obtenerHistorialPorDocumento(@PathVariable Long documentoId) {
        return historialDocumentoService.getHistorialPorDocumento(documentoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<HistorialDocumento> obtenerHistorialPorUsuario(@PathVariable Long usuarioId) {
        return historialDocumentoService.getHistorialPorUsuario(usuarioId);
    }

    @PostMapping
    public HistorialDocumento crearRegistroHistorial(@RequestBody HistorialDocumento historial) {
        return historialDocumentoService.crearHistorial(historial);
    }
}