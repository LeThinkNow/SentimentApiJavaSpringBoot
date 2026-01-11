package com.sentiment.sentimentAPI.repository;

import com.sentiment.sentimentAPI.model.SentimentRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SentimentRecordRepository extends JpaRepository<SentimentRecord, Long> {
    List<SentimentRecord> findByOrderByCreatedAtDesc(Pageable pageable);
}
