package com.finalproject.hrmsbackend.core.entities;

public interface BaseEntity<IdType> {

    IdType getId();

    void setId(IdType id);

}
