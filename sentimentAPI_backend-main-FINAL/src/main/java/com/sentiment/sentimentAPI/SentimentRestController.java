package com.sentiment.sentimentAPI;

import com.opencsv.CSVReader;
import com.sentiment.sentimentAPI.dto.Resultado;
import com.sentiment.sentimentAPI.dto.SentimentRequest;
import com.sentiment.sentimentAPI.dto.SentimentResponse;
import com.sentiment.sentimentAPI.model.SentimentRecord;
import com.sentiment.sentimentAPI.repository.SentimentRecordRepository;
import com.sentiment.sentimentAPI.service.PythonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class SentimentRestController {

    @Autowired
    private PythonService pythonService;

    @Autowired
    private SentimentRecordRepository repository;

    @PostMapping("/sentiment")
    public ResponseEntity<?> analyzeSentiment(@RequestBody(required = false) SentimentRequest request) {
        if (request == null || request.getText() == null || request.getText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El texto es obligatorio."));
        }

        String text = request.getText();
        if (text.length() < 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "El texto debe tener al menos 5 caracteres."));
        }

        Resultado resultado = pythonService.obtenerPrediccion(text, request.getLanguage(), request.getThreshold());

        if (resultado == null || "Error".equals(resultado.getPrevision())) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "No se pudo procesar el sentimiento en este momento."));
        }

        // Persistence
        SentimentRecord record = new SentimentRecord();
        record.setText(text);
        record.setPrediction(resultado.getPrevision());
        record.setProbability(resultado.getProbabilidad());
        record.setCreatedAt(LocalDateTime.now());
        repository.save(record);

        SentimentResponse response = new SentimentResponse(
                resultado.getPrevision(),
                resultado.getProbabilidad(),
                resultado.getTopFeatures());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam(defaultValue = "50") int limit) {
        List<SentimentRecord> records = repository.findByOrderByCreatedAtDesc(PageRequest.of(0, limit));

        if (records.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No hay datos suficientes.", "total", 0));
        }

        long positiveCount = records.stream().filter(r -> "Positivo".equalsIgnoreCase(r.getPrediction())).count();
        long negativeCount = records.stream().filter(r -> "Negativo".equalsIgnoreCase(r.getPrediction())).count();
        long neutralCount = records.size() - positiveCount - negativeCount;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total_analyzed", records.size());
        stats.put("positive_pct", (double) positiveCount / records.size() * 100);
        stats.put("negative_pct", (double) negativeCount / records.size() * 100);
        stats.put("neutral_pct", (double) neutralCount / records.size() * 100);

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/batch")
    public ResponseEntity<?> analyzeBatch(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
        }

        List<Resultado> results = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] line;
            while ((line = reader.readNext()) != null) {
                if (line.length > 0) {
                    String text = line[0]; // Assume first column is text
                    if (text == null || text.trim().isEmpty())
                        continue;

                    Resultado res = pythonService.obtenerPrediccion(text, null, null);
                    if (res != null && !"Error".equals(res.getPrevision())) {
                        results.add(res);

                        // Save to DB
                        SentimentRecord record = new SentimentRecord();
                        record.setText(text);
                        record.setPrediction(res.getPrevision());
                        record.setProbability(res.getProbabilidad());
                        record.setCreatedAt(LocalDateTime.now());
                        repository.save(record);
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error procesando el archivo: " + e.getMessage()));
        }

        return ResponseEntity.ok(results);
    }
}
