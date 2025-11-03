package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.TipoFormato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TipoFormatoRepository extends JpaRepository<TipoFormato, Long> {
    Optional<TipoFormato> findByCodigo(String codigo);
    List<TipoFormato> findByActivoTrue();
}