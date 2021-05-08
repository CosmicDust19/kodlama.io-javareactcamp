package user;

import log.Logger;
import user.check.*;

public class UserManager extends BaseUserManager {

    private UserCheckService checkService;

    public UserManager(UserCheckService checkService, Logger[] loggers) {
        super(loggers);
        this.checkService = checkService;
    }

    @Override
    public void save(User user) {
        if(checkService.checkIfRealPerson(user)) super.save(user);
        else System.out.println("Not a real person.");
    }
}
