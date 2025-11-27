package com.indra.bms_assistant.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", java.time.LocalDateTime.now().toString());
        status.put("service", "BMS Assistant API");
        return status;
    }

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> info = new HashMap<>();
        info.put("message", "BMS Assistant API - Sistema de Gestión Documental con IA");
        info.put("version", "1.0.0");
        info.put("status", "Activo");
        return info;
    }
}