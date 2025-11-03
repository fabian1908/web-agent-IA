package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.SistemaBMS;
import com.indra.bms_assistant.repository.SistemaBMSRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SistemaBMSService {

    private final SistemaBMSRepository sistemaBMSRepository;

    public SistemaBMSService(SistemaBMSRepository sistemaBMSRepository) {
        this.sistemaBMSRepository = sistemaBMSRepository;
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

    public void desactivarSistema(Long id) {
        Optional<SistemaBMS> sistema = sistemaBMSRepository.findById(id);
        if (sistema.isPresent()) {
            SistemaBMS sistemaBMS = sistema.get();
            sistemaBMS.setActivo(false);
            sistemaBMSRepository.save(sistemaBMS);
        }
    }
}