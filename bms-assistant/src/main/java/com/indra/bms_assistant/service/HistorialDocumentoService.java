package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.HistorialDocumento;
import com.indra.bms_assistant.repository.HistorialDocumentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialDocumentoService {

    private final HistorialDocumentoRepository historialDocumentoRepository;

    public HistorialDocumentoService(HistorialDocumentoRepository historialDocumentoRepository) {
        this.historialDocumentoRepository = historialDocumentoRepository;
    }

    public List<HistorialDocumento> getAllHistorial() {
        return historialDocumentoRepository.findAll();
    }

    public List<HistorialDocumento> getHistorialPorDocumento(Long documentoId) {
        return historialDocumentoRepository.findByDocumentoId(documentoId);
    }

    public List<HistorialDocumento> getHistorialPorUsuario(Long usuarioId) {
        return historialDocumentoRepository.findByUsuarioId(usuarioId);
    }

    public HistorialDocumento crearHistorial(HistorialDocumento historial) {
        return historialDocumentoRepository.save(historial);
    }
}