package com.hrms.hw.core.utilities;

import com.hrms.hw.entities.abstracts.BaseEntity;
import lombok.experimental.UtilityClass;
import org.springframework.data.jpa.repository.JpaRepository;

@UtilityClass
public class Utils {

    public String formName(String name){
        if (name != null) {
            StringBuilder sb = new StringBuilder(name.trim().toLowerCase());
            sb.setCharAt(0, Character.toUpperCase(sb.charAt(0)));
            int index = -1;
            while ((index = sb.indexOf(" ", index + 1)) != -1) {
                sb.setCharAt(index + 1, Character.toUpperCase(sb.charAt(index + 1)));
            }
            return sb.toString();
        }
        return null;
    }

    public <S, T extends BaseEntity<S>> boolean tryToSaveIfNotExists(T baseEntity, JpaRepository<T, S> jpaRepository) {
        try {
            if (!jpaRepository.findById(baseEntity.getId()).isPresent()) {
                T savedEntity = jpaRepository.save(baseEntity);
                baseEntity.setId(savedEntity.getId());
            }
            return true;
        } catch (Exception e){
            return false;
        }
    }
}
