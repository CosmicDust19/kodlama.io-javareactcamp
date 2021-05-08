package core.concretes;

import GoogleAuth.GoogleAuthManager;
import core.abstracts.AuthService;

public class GoogleAuthManagerAdapter implements AuthService {

    @Override
    public boolean isValidUser() {
        return new GoogleAuthManager().isValidUserByGoogle();
    }
}
