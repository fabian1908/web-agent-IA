package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.TipoFormato;
import com.indra.bms_assistant.repository.TipoFormatoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoFormatoService {

    private final TipoFormatoRepository tipoFormatoRepository;

    public TipoFormatoService(TipoFormatoRepository tipoFormatoRepository) {
        this.tipoFormatoRepository = tipoFormatoRepository;
    }

    public List<TipoFormato> getAllFormatos() {
        return tipoFormatoRepository.findAll();
    }

    public List<TipoFormato> getFormatosActivos() {
        return tipoFormatoRepository.findByActivoTrue();
    }

    public Optional<TipoFormato> getFormatoById(Long id) {
        return tipoFormatoRepository.findById(id);
    }

    public Optional<TipoFormato> getFormatoByCodigo(String codigo) {
        return tipoFormatoRepository.findByCodigo(codigo);
    }

    public TipoFormato crearFormato(TipoFormato formato) {
        return tipoFormatoRepository.save(formato);
    }

    public TipoFormato actualizarFormato(Long id, TipoFormato formatoActualizado) {
        Optional<TipoFormato> formatoExistente = tipoFormatoRepository.findById(id);
        if (formatoExistente.isPresent()) {
            TipoFormato formato = formatoExistente.get();
            formato.setNombre(formatoActualizado.getNombre());
            formato.setDescripcion(formatoActualizado.getDescripcion());
            formato.setPlantilla(formatoActualizado.getPlantilla());
            return tipoFormatoRepository.save(formato);
        }
        return null;
    }

    public void desactivarFormato(Long id) {
        Optional<TipoFormato> formato = tipoFormatoRepository.findById(id);
        if (formato.isPresent()) {
            TipoFormato tipoFormato = formato.get();
            tipoFormato.setActivo(false);
            tipoFormatoRepository.save(tipoFormato);
        }
    }
}