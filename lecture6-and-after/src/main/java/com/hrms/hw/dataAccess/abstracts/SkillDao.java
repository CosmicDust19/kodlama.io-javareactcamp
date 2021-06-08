package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.Skill;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillDao extends JpaRepository<Skill, Short> {
    Skill getByName(String name);
}
