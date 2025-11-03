package com.indra.bms_assistant.repository;

import com.indra.bms_assistant.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByUsuarioId(Long usuarioId);
    List<Documento> findBySistemaId(Long sistemaId);
    List<Documento> findByTipoFormatoId(Long tipoFormatoId);
}