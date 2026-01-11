package com.sentiment.sentimentAPI.dto;

import java.util.List;

public class SentimentResponse {
    private String prevision;
    private double probabilidad;
    private List<String> topFeatures;

    public SentimentResponse(String prevision, double probabilidad) {
        this.prevision = prevision;
        this.probabilidad = probabilidad;
    }

    public SentimentResponse(String prevision, double probabilidad, List<String> topFeatures) {
        this.prevision = prevision;
        this.probabilidad = probabilidad;
        this.topFeatures = topFeatures;
    }

    public String getPrevision() {
        return prevision;
    }

    public void setPrevision(String prevision) {
        this.prevision = prevision;
    }

    public double getProbabilidad() {
        return probabilidad;
    }

    public void setProbabilidad(double probabilidad) {
        this.probabilidad = probabilidad;
    }

    public List<String> getTopFeatures() {
        return topFeatures;
    }

    public void setTopFeatures(List<String> topFeatures) {
        this.topFeatures = topFeatures;
    }
}
