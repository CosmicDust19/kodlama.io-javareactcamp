package business.concretes;

import business.abstracts.UserCheckService;
import business.abstracts.UserService;
import dataAccess.abstracts.UserDao;
import entities.concretes.User;

public class UserManager implements UserService {

    private final UserDao userDao;
    private final UserCheckService userCheckService;

    public UserManager(UserDao userDao, UserCheckService userCheckService) {
        this.userDao = userDao;
        this.userCheckService = userCheckService;
    }

    @Override
    public void register(User user) {
        if (userCheckService.isValidUser(user, userDao)) {
            userDao.add(user);
            System.out.println("Registration Successful");
            return;
        }
        System.out.println("Registration Failed");
    }

    @Override
    public void login(String email, String password) {
        if (userCheckService.isCorrectLoginInput(email, password, userDao)) {
            System.out.println("User logged in...");
            return;
        }
        System.out.println("Login Failed");
    }

    @Override
    public void update(User user) {
        if (userCheckService.isValidUser(user, userDao)) {
            userDao.update(user);
            System.out.println("Update Successful");
            return;
        }
        System.out.println("Update Failed");
    }

    @Override
    public void delete(User user) {
        userDao.delete(user);
        System.out.println("Delete Successful");
    }
}
