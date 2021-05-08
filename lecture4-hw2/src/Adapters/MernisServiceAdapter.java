package Adapters;
import Abstract.CustomerCheckService;
import Entity.Customer;
import mernisService.KPSPublicLocator;
import mernisService.KPSPublicSoap_PortType;

import javax.xml.rpc.ServiceException;
import java.rmi.RemoteException;


public class MernisServiceAdapter implements CustomerCheckService {
    @Override
    public boolean checkIfRealPerson(Customer customer) {
        KPSPublicSoap_PortType client;
        try {
            client = new KPSPublicLocator().getKPSPublicSoap();
            return client.TCKimlikNoDogrula(Long.parseLong(customer.getNationalityId()), customer.getFirstName(), customer.getLastName(), customer.getDateOfBirth().getYear());
        } catch (ServiceException | RemoteException e) {
            System.out.println("An error has occurred during verification!");
        }
        return false;
    }
}
