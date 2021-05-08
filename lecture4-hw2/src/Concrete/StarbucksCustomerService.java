package Concrete;

import Abstract.*;
import Entity.*;

public class StarbucksCustomerService extends BaseCustomerManager {

    private CustomerCheckService customerCheckService;

    public StarbucksCustomerService(CustomerCheckService customerCheckService) {
        this.customerCheckService = customerCheckService;
    }

    @Override
    public void save(Customer customer) {
        if(customerCheckService.checkIfRealPerson(customer)){
            super.save(customer);
        } else System.out.println("Not a real person");
    }
}