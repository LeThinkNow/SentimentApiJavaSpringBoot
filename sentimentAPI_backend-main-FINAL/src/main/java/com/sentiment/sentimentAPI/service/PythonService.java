package com.sentiment.sentimentAPI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.sentiment.sentimentAPI.dto.Resultado;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PythonService {

    @Value("${ds.url}")
    private String pythonUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Resultado obtenerPrediccion(String texto, String language, Double threshold) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("text", texto);
            if (language != null)
                request.put("language", language);
            if (threshold != null)
                request.put("threshold", threshold);

            Map<String, Object> response = restTemplate.postForObject(pythonUrl, request, Map.class);

            if (response != null) {
                String prev = (String) response.get("prevision");
                Object probObj = response.get("probabilidad");
                Double prob = (probObj instanceof Number) ? ((Number) probObj).doubleValue() : 0.0;

                java.util.List<String> topFeatures = (java.util.List<String>) response.get("top_features");
                if (topFeatures == null)
                    topFeatures = java.util.Collections.emptyList();

                return new Resultado(texto, prev, prob, topFeatures);
            }
        } catch (Exception e) {
            System.err.println("Error Python: " + e.getMessage());
            return new Resultado(texto, "Error", 0.0);
        }
        return null; // Or return error result
    }
}
