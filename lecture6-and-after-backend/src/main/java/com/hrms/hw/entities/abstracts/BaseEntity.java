package com.hrms.hw.entities.abstracts;

public interface BaseEntity<Id> {
    Id getId();
    void setId(Id id);
}
