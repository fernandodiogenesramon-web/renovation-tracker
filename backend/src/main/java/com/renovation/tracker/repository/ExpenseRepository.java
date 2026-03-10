package com.renovation.tracker.repository;

import com.renovation.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT COALESCE(SUM(e.totalAmount), 0) FROM Expense e")
    BigDecimal sumTotalAmount();

    @Query("""
        SELECT e.status, COUNT(e), COALESCE(SUM(e.totalAmount), 0)
        FROM Expense e
        GROUP BY e.status
        """)
    List<Object[]> groupByStatus();

    @Query("""
        SELECT et.name, COUNT(e), COALESCE(SUM(e.totalAmount), 0)
        FROM Expense e
        JOIN e.expenseType et
        GROUP BY et.name
        """)
    List<Object[]> groupByType();

    @Query("""
        SELECT s.name, COALESCE(SUM(e.totalAmount), 0)
        FROM Expense e
        JOIN e.sponsor s
        GROUP BY s.name
        """)
    List<Object[]> groupBySponsor();
}
