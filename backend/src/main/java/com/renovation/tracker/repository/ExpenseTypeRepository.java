package com.renovation.tracker.repository;

import com.renovation.tracker.entity.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseTypeRepository extends JpaRepository<ExpenseType, Long> {
}
