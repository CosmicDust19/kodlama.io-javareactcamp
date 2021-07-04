package com.finalproject.hrmsbackend.core.utilities;

import com.finalproject.hrmsbackend.entities.abstracts.BaseEntity;
import lombok.experimental.UtilityClass;
import org.springframework.data.jpa.repository.JpaRepository;

@UtilityClass
public class Utils {

    public String formName(String name){
        if (name != null) {
            StringBuilder sb = new StringBuilder(name.trim().toLowerCase());
            if (sb.length() == 0) return "";
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
            if (!jpaRepository.existsById(baseEntity.getId())) {
                //if it throws an error while saving, then entity saved before and the id was wrong
                T savedEntity = jpaRepository.save(baseEntity);
                baseEntity.setId(savedEntity.getId());
            }
            //success (this boolean value , expresses that the id is available in the database)
            return true;
        } catch (Exception exception){
            //fail (if the return value is false, then threw an error and the id needed to be set after this method)
            System.out.println(exception.getMessage());
            return false;
        }
    }
}
