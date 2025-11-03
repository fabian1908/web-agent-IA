package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.AgenteIA;
import com.indra.bms_assistant.repository.AgenteIARepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgenteIAService {

    private final AgenteIARepository agenteIARepository;

    public AgenteIAService(AgenteIARepository agenteIARepository) {
        this.agenteIARepository = agenteIARepository;
    }

    public List<AgenteIA> getAllAgentes() {
        return agenteIARepository.findAll();
    }

    public List<AgenteIA> getAgentesActivos() {
        return agenteIARepository.findByActivoTrue();
    }

    public List<AgenteIA> getAgentesPorSistema(Long sistemaId) {
        return agenteIARepository.findBySistemaId(sistemaId);
    }

    public List<AgenteIA> getAgentesPorFormato(Long tipoFormatoId) {
        return agenteIARepository.findByTipoFormatoId(tipoFormatoId);
    }

    public Optional<AgenteIA> getAgenteById(Long id) {
        return agenteIARepository.findById(id);
    }

    public AgenteIA crearAgente(AgenteIA agente) {
        return agenteIARepository.save(agente);
    }

    public AgenteIA actualizarAgente(Long id, AgenteIA agenteActualizado) {
        Optional<AgenteIA> agenteExistente = agenteIARepository.findById(id);
        if (agenteExistente.isPresent()) {
            AgenteIA agente = agenteExistente.get();
            agente.setNombre(agenteActualizado.getNombre());
            agente.setDescripcion(agenteActualizado.getDescripcion());
            agente.setConfiguracion(agenteActualizado.getConfiguracion());
            agente.setModeloIA(agenteActualizado.getModeloIA());
            return agenteIARepository.save(agente);
        }
        return null;
    }

    public void desactivarAgente(Long id) {
        Optional<AgenteIA> agente = agenteIARepository.findById(id);
        if (agente.isPresent()) {
            AgenteIA agenteIA = agente.get();
            agenteIA.setActivo(false);
            agenteIARepository.save(agenteIA);
        }
    }
}