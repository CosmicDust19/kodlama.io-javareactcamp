package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillDao extends JpaRepository<Skill, Integer> {
}
