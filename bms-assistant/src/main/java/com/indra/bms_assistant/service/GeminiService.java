package com.indra.bms_assistant.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
    }

    public String chat(String message, String systemInstruction, String modelName) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        
        List<Map<String, Object>> contents = new ArrayList<>();
        
        // Add system instruction if present (Gemini supports system instructions, but for simplicity in v1beta/gemini-pro standard endpoint, we can prepend it or use system_instruction field if supported by the specific model version. 
        // For broad compatibility with gemini-pro, we will prepend it to the user message or context if it's a simple chat).
        // However, better models support "system_instruction". Let's try to just prepend it for now to be safe with standard generateContent.
        
        String fullMessage = message;
        if (systemInstruction != null && !systemInstruction.isEmpty()) {
            // Context injection
            fullMessage = "Instrucciones del Sistema: " + systemInstruction + "\n\nUsuario: " + message;
        }

        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        Map<String, String> part = new HashMap<>();
        part.put("text", fullMessage);
        userContent.put("parts", Collections.singletonList(part));
        
        contents.add(userContent);
        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Error: No se pudo obtener respuesta de Gemini.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error al comunicar con Gemini: " + e.getMessage();
        }
    }
}
