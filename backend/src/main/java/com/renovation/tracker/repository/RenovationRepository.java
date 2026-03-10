package com.renovation.tracker.repository;

import com.renovation.tracker.entity.Renovation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface RenovationRepository extends JpaRepository<Renovation, Long> {
    @Query("SELECT COALESCE(SUM(r.budget), 0) FROM Renovation r")
    BigDecimal sumTotalBudget();
}
