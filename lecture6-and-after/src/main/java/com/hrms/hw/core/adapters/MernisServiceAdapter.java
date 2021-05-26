package com.hrms.hw.core.adapters;

import mernis.KPSPublicLocator;

import javax.xml.rpc.ServiceException;

public class MernisServiceAdapter {

    public boolean isNatIdReal(String TCNO, String name, String surname, short birthYear) throws ServiceException {

        try {
            return new KPSPublicLocator().getKPSPublicSoap().TCKimlikNoDogrula(Long.parseLong(TCNO), name, surname, birthYear);
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }

    }

}
