package com.hrms.lecture6hw2.business.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Job;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface JobService {
    List<Job> getAll();
}
