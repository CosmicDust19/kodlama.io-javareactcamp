package com.finalproject.hrmsbackend.core.adapters;

import org.springframework.stereotype.Component;

@Component
public class MernisServiceAdapter {

    //I removed mernis for now because it causes an error when deploying the app to heroku
    public boolean isRealPerson(String tcno, String name, String surname, short birthYear) {

        return true;

    }

    /*public boolean isRealPerson(String tcno, String name, String surname, short birthYear) {

        try {
            return new KPSPublicLocator().getKPSPublicSoap().TCKimlikNoDogrula(Long.parseLong(tcno), name, surname, birthYear);
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }

    }*/

}
