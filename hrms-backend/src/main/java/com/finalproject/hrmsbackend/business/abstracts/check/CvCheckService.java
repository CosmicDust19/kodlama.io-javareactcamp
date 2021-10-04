package com.finalproject.hrmsbackend.business.abstracts.check;

import java.util.Map;

public interface CvCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsCvById(Integer cvId);

    void notExistsCvByTitleAndCandidateId(String title, Integer candId);

}
