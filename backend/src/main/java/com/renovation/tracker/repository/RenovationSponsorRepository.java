package com.renovation.tracker.repository;

import com.renovation.tracker.entity.RenovationSponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RenovationSponsorRepository extends JpaRepository<RenovationSponsor, Long> {
    List<RenovationSponsor> findByRenovationId(Long renovationId);
}
