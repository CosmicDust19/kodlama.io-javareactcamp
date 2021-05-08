package Abstract;

import Entity.Customer;

public interface CustomerCheckService {
    boolean checkIfRealPerson(Customer customer);
}
