package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.HistorialDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialDocumentoRepository extends JpaRepository<HistorialDocumento, Long> {
    List<HistorialDocumento> findByDocumentoId(Long documentoId);
    List<HistorialDocumento> findByUsuarioId(Long usuarioId);
}