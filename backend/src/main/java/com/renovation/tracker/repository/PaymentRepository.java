package com.renovation.tracker.repository;

import com.renovation.tracker.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByExpenseId(Long expenseId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.expense.id = :expenseId AND p.status = 'PAID'")
    BigDecimal sumPaidByExpenseId(Long expenseId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.expense.id = :expenseId AND p.status = 'PENDING'")
    BigDecimal sumPendingByExpenseId(Long expenseId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PAID'")
    BigDecimal sumAllPaid();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PENDING'")
    BigDecimal sumAllPending();

    @Query("""
    SELECT e.sponsor.name, COALESCE(SUM(p.amount), 0)
    FROM Payment p
    JOIN p.expense e
    WHERE p.status = 'PAID'
    GROUP BY e.sponsor.name
    """)
    List<Object[]> sumPaidGroupedBySponsor();
}