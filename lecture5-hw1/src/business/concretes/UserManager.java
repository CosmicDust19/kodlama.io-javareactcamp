package business.concretes;

import business.abstracts.UserCheckService;
import business.abstracts.UserService;
import core.abstracts.EmailService;
import dataAccess.abstracts.UserDao;
import entities.concretes.User;

public class UserManager implements UserService {

    private final UserDao userDao;
    private final UserCheckService userCheckService;
    private final EmailService emailService;

    public UserManager(UserDao userDao, UserCheckService userCheckService, EmailService emailService) {
        this.userDao = userDao;
        this.userCheckService = userCheckService;
        this.emailService = emailService;
    }

    @Override
    public void register(User user) {
        if (userCheckService.tryAuthService()) {
            userDao.add(user);
            System.out.println("Registration Successful");
        } else if ((userCheckService.isValidUser(user, userDao) && !userCheckService.isUsedEmail(user.getEmail(), userDao))) {
            emailService.sendVerificationMail(user.getEmail());
            System.out.println("Verified✓");
            userDao.add(user);
            System.out.println("Registration Successful");
        } else System.out.println("Registration Failed");
    }

    @Override
    public void login(String email, String password) {
        if (userCheckService.isValidLogin(email, password, userDao)) {
            System.out.println("User logged in...");
        } else System.out.println("Login Failed");
    }

    @Override
    public void update(User user) {
        User oldUser = userDao.getById(user.getId());
        if (oldUser == null) {
            System.out.println("Update Failed : User id does not match any of user in our database!");
        } else if(userCheckService.tryAuthService()){
            System.out.println("Because you approved by google, you cannot change your infos for now :(");
        } else if (!userCheckService.isThereAnyChange(user,oldUser)){
            System.out.println("No change detected!");
        } else if (userCheckService.isValidUser(user, userDao)) {
            if (!oldUser.getEmail().equals(user.getEmail())) {
                emailService.sendVerificationMail(user.getEmail());
                System.out.println("Verified✓");
            }
            userDao.update(user, oldUser);
            System.out.println("Update Successful");
        } else System.out.println("Update Failed");
    }

    @Override
    public void delete(User user) {
        if (userDao.getById(user.getId()) != null) {
            userDao.delete(user);
            System.out.println("Delete Successful");
        } else System.out.println("Delete Failed: There is no such a user...");
    }


}
