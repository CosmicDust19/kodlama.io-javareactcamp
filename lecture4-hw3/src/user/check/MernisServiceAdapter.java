package user.check;

import java.rmi.RemoteException;

import mernisService.KPSPublicLocator;
import mernisService.KPSPublicSoap_PortType;
import user.User;

import javax.xml.rpc.ServiceException;

public class MernisServiceAdapter implements UserCheckService {
    @Override
    public boolean checkIfRealPerson(User user) {
		KPSPublicSoap_PortType client;
		try {
			client = new KPSPublicLocator().getKPSPublicSoap();
			return client.TCKimlikNoDogrula(Long.parseLong(user.getNationalityId()), user.getFirstName(), user.getLastName(), user.getBirthDate().getYear());
		} catch (ServiceException | RemoteException e) {
			System.out.println("An error has occurred during verification!");
		}
		return false;
    }
}
