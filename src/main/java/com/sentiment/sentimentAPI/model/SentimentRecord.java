package com.sentiment.sentimentAPI.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sentiment_records")
public class SentimentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text;

    private String prediction;
    private Double probability;
    private LocalDateTime createdAt;

    public SentimentRecord() {
    }

    public SentimentRecord(String text, String prediction, Double probability, LocalDateTime createdAt) {
        this.text = text;
        this.prediction = prediction;
        this.probability = probability;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public Double getProbability() {
        return probability;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
