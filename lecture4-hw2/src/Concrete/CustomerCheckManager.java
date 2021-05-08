package Concrete;

import Abstract.CustomerCheckService;
import Entity.*;

public class CustomerCheckManager implements CustomerCheckService {

    @Override
    public boolean checkIfRealPerson(Customer customer) {
        return true;
    }
}
