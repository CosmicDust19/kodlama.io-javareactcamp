import java.time.LocalDate;

import Abstract.*;
import Adapters.MernisServiceAdapter;
import Entity.*;
import Concrete.*;

public class Main {
    public static void main(String[] args) {

        Customer customer = new Customer(1,"Muhittin","Topalak","53011265431",LocalDate.parse("1979-07-28"));

        BaseCustomerManager starbucksCustomerService = new StarbucksCustomerService(new MernisServiceAdapter());
        starbucksCustomerService.save(customer);
    }
}