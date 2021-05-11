package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.JobService;
import com.hrms.lecture6hw2.dataAccess.abstracts.JobDao;
import com.hrms.lecture6hw2.entities.concretes.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobManager implements JobService {

    private final JobDao jobDao;

    @Autowired
    public JobManager(JobDao jobDao) {
        this.jobDao = jobDao;
    }

    @Override
    public List<Job> getAll() {
        return jobDao.findAll();
    }
}
