package com.finalproject.hrmsbackend.business.abstracts.check;

import java.util.HashMap;
import java.util.Map;

public abstract class BaseCheckManager implements BaseCheckService {

    protected Map<String, String> errors = new HashMap<>();

    public Map<String, String> getErrors() {
        Map<String, String> temp = errors;
        this.errors = new HashMap<>();
        return temp;
    }
    
}
