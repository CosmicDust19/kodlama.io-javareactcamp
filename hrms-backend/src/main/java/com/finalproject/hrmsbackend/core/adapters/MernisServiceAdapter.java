package com.finalproject.hrmsbackend.core.adapters;

import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import org.springframework.stereotype.Component;

@Component
public class MernisServiceAdapter implements MernisService {

    //I removed mernis for now because it causes an error while deploying the app
    public boolean isRealPerson(CandidateAddDto dto) {

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
