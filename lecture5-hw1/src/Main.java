import business.concretes.UserCheckManager;
import business.concretes.UserManager;
import core.concretes.EmailManager;
import core.concretes.GoogleAuthManagerAdapter;
import dataAccess.concretes.HibernateUserDao;
import entities.concretes.User;

public class Main {
    public static void main(String[] args) {

        User user1 = new User(1, "User", "User", "smh01.2019@gmail.com", "123456");
        User user2 = new User(2, "Muhittin", "Topalak", "smh01.2019@gmail.com", "1234567");
        User user3 = new User();

        System.out.println();

        UserManager userManager1 = new UserManager(new HibernateUserDao(), new UserCheckManager(new EmailManager()));
        userManager1.register(user1);
        userManager1.login(user1.getEmail(), user1.getPassword());

        System.out.println();

        userManager1.register(user2);
        userManager1.login(user2.getEmail(), user2.getPassword());

        System.out.println();

        //register and login via google
        UserManager userManager2 = new UserManager(new HibernateUserDao(), new UserCheckManager(new GoogleAuthManagerAdapter(), new EmailManager()));
        userManager2.register(user3);
        userManager2.login(user3.getEmail(), user3.getPassword());
    }
}
