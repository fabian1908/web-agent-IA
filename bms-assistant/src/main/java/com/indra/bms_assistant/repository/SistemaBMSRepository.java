package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.SistemaBMS;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SistemaBMSRepository extends JpaRepository<SistemaBMS, Long> {
    List<SistemaBMS> findByUsuarioId(Long usuarioId);
    List<SistemaBMS> findByActivoTrue();
}