package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.AgenteIA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgenteIARepository extends JpaRepository<AgenteIA, Long> {
    List<AgenteIA> findBySistemaId(Long sistemaId);
    List<AgenteIA> findByTipoFormatoId(Long tipoFormatoId);
    List<AgenteIA> findByActivoTrue();
}