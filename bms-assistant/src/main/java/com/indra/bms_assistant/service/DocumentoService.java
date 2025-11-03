package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.Documento;
import com.indra.bms_assistant.repository.DocumentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;

    public DocumentoService(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    public List<Documento> getAllDocumentos() {
        return documentoRepository.findAll();
    }

    public List<Documento> getDocumentosPorUsuario(Long usuarioId) {
        return documentoRepository.findByUsuarioId(usuarioId);
    }

    public List<Documento> getDocumentosPorSistema(Long sistemaId) {
        return documentoRepository.findBySistemaId(sistemaId);
    }

    public Optional<Documento> getDocumentoById(Long id) {
        return documentoRepository.findById(id);
    }

    public Documento crearDocumento(Documento documento) {
        return documentoRepository.save(documento);
    }

    public Documento actualizarDocumento(Long id, Documento documentoActualizado) {
        Optional<Documento> documentoExistente = documentoRepository.findById(id);
        if (documentoExistente.isPresent()) {
            Documento documento = documentoExistente.get();
            documento.setTitulo(documentoActualizado.getTitulo());
            documento.setContenido(documentoActualizado.getContenido());
            documento.setEstado(documentoActualizado.getEstado());
            documento.setObservaciones(documentoActualizado.getObservaciones());
            documento.setCalificacion(documentoActualizado.getCalificacion());
            return documentoRepository.save(documento);
        }
        return null;
    }
}