package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.Usuario;
import com.indra.bms_assistant.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(id);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerUsuarioPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.getUsuarioByEmail(email);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    // CORREGIDO: Método DELETE que retorna ResponseEntity<?>
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        boolean eliminado = usuarioService.eliminarUsuario(id);
        if (eliminado) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario desactivado correctamente");
            response.put("id", id);
            response.put("status", "DESACTIVADO");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // CORREGIDO: Método PUT para reactivar
    @PutMapping("/{id}/reactivar")
    public ResponseEntity<?> reactivarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(id);
        if (usuario.isPresent()) {
            Usuario usuarioExistente = usuario.get();
            usuarioExistente.setActivo(true);
            Usuario usuarioActualizado = usuarioService.crearUsuario(usuarioExistente);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario reactivado correctamente");
            response.put("id", id);
            response.put("status", "ACTIVO");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
}