package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.SistemaBMS;
import com.indra.bms_assistant.model.AgenteIA;
import com.indra.bms_assistant.model.Documento;
import com.indra.bms_assistant.repository.SistemaBMSRepository;
import com.indra.bms_assistant.repository.AgenteIARepository;
import com.indra.bms_assistant.repository.DocumentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SistemaBMSService {

    private final SistemaBMSRepository sistemaBMSRepository;
    private final AgenteIARepository agenteIARepository;
    private final DocumentoRepository documentoRepository;

    public SistemaBMSService(SistemaBMSRepository sistemaBMSRepository, AgenteIARepository agenteIARepository, DocumentoRepository documentoRepository) {
        this.sistemaBMSRepository = sistemaBMSRepository;
        this.agenteIARepository = agenteIARepository;
        this.documentoRepository = documentoRepository;
    }

    public List<SistemaBMS> getAllSistemas() {
        return sistemaBMSRepository.findAll();
    }

    public List<SistemaBMS> getSistemasActivos() {
        return sistemaBMSRepository.findByActivoTrue();
    }

    public List<SistemaBMS> getSistemasPorUsuario(Long usuarioId) {
        return sistemaBMSRepository.findByUsuarioId(usuarioId);
    }

    public Optional<SistemaBMS> getSistemaById(Long id) {
        return sistemaBMSRepository.findById(id);
    }

    public SistemaBMS crearSistema(SistemaBMS sistema) {
        return sistemaBMSRepository.save(sistema);
    }

    public SistemaBMS actualizarSistema(Long id, SistemaBMS sistemaActualizado) {
        Optional<SistemaBMS> sistemaExistente = sistemaBMSRepository.findById(id);
        if (sistemaExistente.isPresent()) {
            SistemaBMS sistema = sistemaExistente.get();
            sistema.setNombre(sistemaActualizado.getNombre());
            sistema.setDescripcion(sistemaActualizado.getDescripcion());
            sistema.setProtocoloComunicacion(sistemaActualizado.getProtocoloComunicacion());
            sistema.setFabricante(sistemaActualizado.getFabricante());
            return sistemaBMSRepository.save(sistema);
        }
        return null;
    }

    public void eliminarSistema(Long id) {
        // Desvincular agentes
        List<AgenteIA> agentes = agenteIARepository.findBySistemaId(id);
        for (AgenteIA agente : agentes) {
            agente.setSistemaId(null);
            agenteIARepository.save(agente);
        }

        // Desvincular documentos
        List<Documento> documentos = documentoRepository.findBySistemaId(id);
        for (Documento documento : documentos) {
            documento.setSistemaId(null);
            documentoRepository.save(documento);
        }

        sistemaBMSRepository.deleteById(id);
    }
}
