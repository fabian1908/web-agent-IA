package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.Documento;
import com.indra.bms_assistant.service.DocumentoService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
public class GeneracionAIController {

    private final DocumentoService documentoService;

    public GeneracionAIController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @PostMapping("/generar-documento")
    public Map<String, Object> generarDocumentoConIA(@RequestBody Map<String, Object> solicitud) {
        // Este endpoint se integrará con Gemini AI
        Map<String, Object> respuesta = new HashMap<>();

        String tipoFormato = (String) solicitud.get("tipoFormato");
        Long sistemaId = Long.valueOf(solicitud.get("sistemaId").toString());
        Long usuarioId = Long.valueOf(solicitud.get("usuarioId").toString());
        Map<String, Object> datos = (Map<String, Object>) solicitud.get("datos");

        // Simulación de generación con IA (por ahora)
        String contenidoGenerado = generarContenidoSimulado(tipoFormato, datos);

        // Crear documento
        Documento documento = new Documento();
        documento.setTitulo("Documento generado por IA - " + tipoFormato);
        documento.setContenido(contenidoGenerado);
        documento.setTipoFormatoId(getTipoFormatoId(tipoFormato));
        documento.setSistemaId(sistemaId);
        documento.setUsuarioId(usuarioId);
        documento.setEstado("BORRADOR");

        Documento documentoCreado = documentoService.crearDocumento(documento);

        respuesta.put("success", true);
        respuesta.put("documento", documentoCreado);
        respuesta.put("mensaje", "Documento generado exitosamente con IA");

        return respuesta;
    }

    private String generarContenidoSimulado(String tipoFormato, Map<String, Object> datos) {
        // Simulación - luego se integrará con Gemini AI
        return "Este es un documento de tipo " + tipoFormato +
                " generado automáticamente. Datos proporcionados: " + datos.toString();
    }

    private Long getTipoFormatoId(String tipoFormato) {
        // Mapear tipo de formato a ID (N1 -> 1, N2 -> 2, N3 -> 3)
        switch(tipoFormato) {
            case "N1": return 1L;
            case "N2": return 2L;
            case "N3": return 3L;
            default: return 1L;
        }
    }
}