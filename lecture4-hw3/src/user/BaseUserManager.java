package user;

import log.Logger;
import misc.Utils;

public abstract class BaseUserManager implements UserService{

    private Logger[] loggers;

    protected BaseUserManager(Logger[] loggers) {
        this.loggers = loggers;
    }

    @Override
    public void save(User user) {
        Utils.runLoggers(loggers,user);
    }

    @Override
    public void saveMulti(User[] users) {
        for (User user: users){
            save(user);
        }
    }

    @Override
    public void delete(User user) {
        System.out.println("User deleted: " + user.getFirstName());
    }

    @Override
    public void saveChanges(User user) {
        System.out.println("Changes have been saved: " + user.getFirstName());
    }

    @Override
    public void changeUserInfo(User user) {
        //changing processes here...
        saveChanges(user);
    }

    @Override
    public void completeShopping(User user) {
        //shopping processes here...
        //note: campaigns will be applied to games in cart individually
        System.out.println("Transaction is successful: " + user.getFirstName());
    }
}
