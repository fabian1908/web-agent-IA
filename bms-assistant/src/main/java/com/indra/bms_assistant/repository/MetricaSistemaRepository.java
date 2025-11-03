package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.MetricaSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MetricaSistemaRepository extends JpaRepository<MetricaSistema, Long> {
    List<MetricaSistema> findByDocumentoId(Long documentoId);
}