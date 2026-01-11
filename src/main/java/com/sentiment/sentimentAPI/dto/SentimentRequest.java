package com.sentiment.sentimentAPI.dto;

public class SentimentRequest {
    private String text;
    private String language; // "es", "en", "pt"
    private Double threshold;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }
}
