package Abstract;

import Entity.Customer;

public abstract class BaseCustomerManager implements CustomerService{
    @Override
    public void save(Customer customer) {
        System.out.println("Custumer Saved To Database: " + customer.getFirstName());
    }
}
