package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.Documento;
import com.indra.bms_assistant.service.DocumentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @GetMapping
    public List<Documento> obtenerTodosLosDocumentos() {
        return documentoService.getAllDocumentos();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Documento> obtenerDocumentosPorUsuario(@PathVariable Long usuarioId) {
        return documentoService.getDocumentosPorUsuario(usuarioId);
    }

    @GetMapping("/sistema/{sistemaId}")
    public List<Documento> obtenerDocumentosPorSistema(@PathVariable Long sistemaId) {
        return documentoService.getDocumentosPorSistema(sistemaId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Documento> obtenerDocumentoPorId(@PathVariable Long id) {
        Optional<Documento> documento = documentoService.getDocumentoById(id);
        return documento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Documento crearDocumento(@RequestBody Documento documento) {
        return documentoService.crearDocumento(documento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Documento> actualizarDocumento(@PathVariable Long id, @RequestBody Documento documento) {
        Documento documentoActualizado = documentoService.actualizarDocumento(id, documento);
        if (documentoActualizado != null) {
            return ResponseEntity.ok(documentoActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDocumento(@PathVariable Long id) {
        documentoService.eliminarDocumento(id);
        return ResponseEntity.ok().build();
    }
}
