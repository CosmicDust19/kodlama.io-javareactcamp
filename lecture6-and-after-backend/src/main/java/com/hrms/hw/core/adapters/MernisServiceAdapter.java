package com.hrms.hw.core.adapters;

import mernis.KPSPublicLocator;
import org.springframework.stereotype.Component;

@Component
public class MernisServiceAdapter {

    public boolean isRealPerson(String tcno, String name, String surname, short birthYear) {

        try {
            return new KPSPublicLocator().getKPSPublicSoap().TCKimlikNoDogrula(Long.parseLong(tcno), name, surname, birthYear);
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }

    }

}
