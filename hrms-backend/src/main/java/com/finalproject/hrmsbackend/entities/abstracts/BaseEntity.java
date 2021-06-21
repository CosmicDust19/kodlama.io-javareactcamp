package com.finalproject.hrmsbackend.entities.abstracts;

public interface BaseEntity<Id> {
    Id getId();
    void setId(Id id);
}
