package business.concretes;

import business.abstracts.UserCheckService;
import business.abstracts.UserService;
import core.abstracts.EmailService;
import dataAccess.abstracts.UserDao;
import entities.concretes.User;
import org.postgresql.util.PSQLException;

import java.sql.SQLException;


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
    public void login(String email, String password) {
        if (userCheckService.isValidLogin(email, password, userDao)) {
            System.out.println("User logged in...");
        } else System.out.println("Login Failed");
    }

    @Override
    public void register(User user) {
        if (userCheckService.tryAuthService()) {
            System.out.println("Registration Successful");
        } else if ((userCheckService.isValidUser(user, userDao))) {
            try {
                userDao.add(user);
                System.out.println("Created User Id: " + userDao.getByEmail(user.getEmail()).getId());
                emailService.sendVerificationMail(user.getEmail());
                System.out.println("Verified✓");
                System.out.println("Registration Successful");
            } catch (PSQLException psqlException) {
                if (psqlException.getMessage().startsWith("uk_users_email", 26)) {
                    System.out.println("Email is used before!");
                    System.out.println("Registration Failed");
                } else psqlException.printStackTrace();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        } else System.out.println("Registration Failed");
    }

    @Override
    public void update(int id, User user) {
        if (userCheckService.tryAuthService()) {
            System.out.println("Because you approved by google, you cannot change your infos for now :(");
        } else if (userCheckService.isValidUser(user, userDao)) {
            User userOld = userDao.getById(id);
            if (!userCheckService.isThereAnyChange(user,userOld)){
                System.out.println("Update Failed");
            } else if (userOld.getEmail() != null) {
                try {
                    userDao.update(id, user);
                    if (!user.getEmail().equals(userOld.getEmail())) {
                        System.out.println("Because you changed your email, you should verify again.");
                        emailService.sendVerificationMail(user.getEmail());
                        System.out.println("Verified✓");
                    }
                    System.out.println("Update Successful");
                } catch (PSQLException psqlException) {
                    if (psqlException.getMessage().startsWith("uk_users_email", 26)) {
                        System.out.println("Email is used before!");
                        System.out.println("Update Failed");
                    } else psqlException.printStackTrace();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            } else System.out.println("There is no such a id in the system...");
        } else System.out.println("Update Failed");
    }

    @Override
    public void delete(int id) {
        if (userDao.getById(id).getEmail() != null) {
            try {
                userDao.delete(id);
                System.out.println("Delete Successful");
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        } else System.out.println("There is no such a id in the system... Deletion Failed.");
    }
}
