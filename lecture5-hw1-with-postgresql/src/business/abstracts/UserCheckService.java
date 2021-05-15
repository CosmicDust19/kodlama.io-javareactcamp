package business.abstracts;


import dataAccess.abstracts.UserDao;
import entities.concretes.User;

public interface UserCheckService {
    boolean isValidFirstName(String firstName);

    boolean isValidLastName(String lastName);

    boolean isValidPassword(String password);

    boolean isValidEmailFormat(String email);

    boolean isValidUser(User user, UserDao userDao);

    boolean isValidLogin(String email, String password, UserDao userDao);

    boolean isThereAnyChange(User user, User userOld);

    boolean tryAuthService();
}
