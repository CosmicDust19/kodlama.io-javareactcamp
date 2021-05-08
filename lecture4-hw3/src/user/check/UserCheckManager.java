package user.check;

import user.User;

public class UserCheckManager implements UserCheckService {
    @Override
    public boolean checkIfRealPerson(User user) {
        return true;
    }
}
