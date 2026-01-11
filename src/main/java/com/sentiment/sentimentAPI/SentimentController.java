package com.sentiment.sentimentAPI;

import com.sentiment.sentimentAPI.dto.Resultado;
import com.sentiment.sentimentAPI.service.PythonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Controller
public class SentimentController {

    @Autowired
    private PythonService pythonService;

    @Autowired
    private com.sentiment.sentimentAPI.repository.SentimentRecordRepository repository;

    @GetMapping("/")
    public String index() {

        return "index";
    }

    @PostMapping("/procesar")
    public String procesarArchivo(@RequestParam("archivo") MultipartFile file, Model model) {
        List<Resultado> lista = new ArrayList<>();
        int pos = 0, neg = 0;

        if (!file.isEmpty()) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                String linea;
                while ((linea = br.readLine()) != null) {
                    if (linea.trim().isEmpty()) continue;
                    // Pass null for language and threshold as this is simple file processing
                    Resultado res = pythonService.obtenerPrediccion(linea, null, null);
                    if (res != null) {
                        lista.add(res);
                        if ("Positivo".equalsIgnoreCase(res.getPrevision())) pos++;
                        else if ("Negativo".equalsIgnoreCase(res.getPrevision())) neg++;
                        
                        // Persistence
                        com.sentiment.sentimentAPI.model.SentimentRecord record = new com.sentiment.sentimentAPI.model.SentimentRecord();
                        record.setText(linea);
                        record.setPrediction(res.getPrevision());
                        record.setProbability(res.getProbabilidad());
                        record.setCreatedAt(java.time.LocalDateTime.now());
                        repository.save(record);
                    }
                }
            } catch (Exception e) { e.printStackTrace(); }
        }

        // Enviamos datos al Front
        model.addAttribute("mostrarResultados", true);
        model.addAttribute("listaResultados", lista);
        model.addAttribute("totalPos", pos);
        model.addAttribute("totalNeg", neg);
        model.addAttribute("totalTotal", lista.size());

        return "index";
    }
}