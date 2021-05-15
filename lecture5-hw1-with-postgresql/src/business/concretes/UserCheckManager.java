package business.concretes;

import business.abstracts.UserCheckService;
import core.abstracts.AuthService;
import dataAccess.abstracts.UserDao;
import entities.concretes.User;

import java.util.regex.Pattern;

public class UserCheckManager implements UserCheckService {

    private AuthService authService;

    public UserCheckManager() {
    }

    public UserCheckManager(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean isValidFirstName(String firstName) {
        if (firstName.length() >= 2) return true;
        System.out.println("First name cannot be less than 2 character!");
        return false;
    }

    @Override
    public boolean isValidLastName(String lastName) {
        if (lastName.length() >= 2) return true;
        System.out.println("Last name cannot be less than 2 character!");
        return false;
    }

    @Override
    public boolean isValidPassword(String password) {
        if (password.length() >= 6) return true;
        System.out.println("Password cannot be less than 6 character");
        return false;
    }

    @Override
    public boolean isValidEmailFormat(String email) {
        String emailRegex = "^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$";
        Pattern pattern = Pattern.compile(emailRegex);
        if (email == null) {
            System.out.println("Wrong email format!");
            return false;
        } else if (!pattern.matcher(email).matches()){
            System.out.println("Wrong email format!");
            return false;
        }
        return true;
    }

    @Override
    public boolean isValidUser(User user, UserDao userDao) {
        if (!isValidFirstName(user.getFirstName())) return false;
        else if (!isValidLastName(user.getLastName())) return false;
        else if (!isValidEmailFormat(user.getEmail())) return false;
        else return isValidPassword(user.getPassword());
    }

    @Override
    public boolean isValidLogin(String email, String password, UserDao userDao) {
        if (authService != null) return authService.isValidUser();
        User user = userDao.getByEmail(email);
        if (user.getPassword() == null) {
            System.out.println("Incorrect e-mail!");
            return false;
        } else if (!user.getPassword().equals(password)) {
            System.out.println("Incorrect password!");
            return false;
        }
        return true;
    }

    @Override
    public boolean isThereAnyChange(User user, User userOld) {
        if (user.getFirstName().equals(userOld.getFirstName()) &&
                user.getLastName().equals(userOld.getLastName()) &&
                user.getEmail().equals(userOld.getEmail()) &&
                user.getPassword().equals(userOld.getPassword())){
            System.out.println("No change detected");
            return false;
        }
        return true;
    }


    @Override
    public boolean tryAuthService() {
        if (authService != null) return authService.isValidUser();
        return false;
    }
}
