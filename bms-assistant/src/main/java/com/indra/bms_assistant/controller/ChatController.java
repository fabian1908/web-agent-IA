package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.AgenteIA;
import com.indra.bms_assistant.repository.AgenteIARepository;
import com.indra.bms_assistant.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Permitir peticiones desde el frontend
public class ChatController {

    private final GeminiService geminiService;
    private final AgenteIARepository agenteIARepository;

    public ChatController(GeminiService geminiService, AgenteIARepository agenteIARepository) {
        this.geminiService = geminiService;
        this.agenteIARepository = agenteIARepository;
    }

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        Long agentId = Long.valueOf(payload.get("agentId").toString());
        
        Optional<AgenteIA> agentOpt = agenteIARepository.findById(agentId);
        
        if (agentOpt.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Agente no encontrado");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        AgenteIA agent = agentOpt.get();
        String systemInstruction = agent.getConfiguracion(); // Usamos la configuración como instrucción del sistema
        String modelName = agent.getModeloIA() != null ? agent.getModeloIA() : "gemini-pro";

        String aiResponse = geminiService.chat(message, systemInstruction, modelName);

        Map<String, String> response = new HashMap<>();
        response.put("response", aiResponse);
        response.put("agentName", agent.getNombre());
        
        return ResponseEntity.ok(response);
    }
}
