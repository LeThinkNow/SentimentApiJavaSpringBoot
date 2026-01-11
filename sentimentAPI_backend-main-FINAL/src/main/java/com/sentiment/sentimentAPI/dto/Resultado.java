package com.sentiment.sentimentAPI.dto;

import java.util.List;

public class Resultado {
    private String texto;
    private String prevision;
    private double probabilidad;
    private List<String> topFeatures;
    private String estiloClase;

    public Resultado() {}

    public Resultado(String texto, String prevision, double probabilidad) {
        this.texto = texto;
        this.prevision = prevision;
        this.probabilidad = probabilidad;
        this.topFeatures = List.of();
        updateStyle();
    }

    public Resultado(String texto, String prevision, double probabilidad, List<String> topFeatures) {
        this.texto = texto;
        this.prevision = prevision;
        this.probabilidad = probabilidad;
        this.topFeatures = topFeatures;
        updateStyle();
    }

    private void updateStyle() {
        if ("Positivo".equalsIgnoreCase(prevision)) this.estiloClase = "text-success fw-bold";
        else if ("Negativo".equalsIgnoreCase(prevision)) this.estiloClase = "text-danger fw-bold";
        else this.estiloClase = "text-muted fw-bold";
    }

    public String getTexto() { return texto; }
    public String getPrevision() { return prevision; }
    public double getProbabilidad() { return probabilidad; }
    public List<String> getTopFeatures() { return topFeatures; }
    public String getEstiloClase() { return estiloClase; }
    public String getProbabilidadPorcentaje() { return Math.round(probabilidad * 100) + "%"; }
}
