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

        UserManager userManager1 = new UserManager(new HibernateUserDao(), new UserCheckManager(), new EmailManager());

        System.out.println("\n1--- register test");
        userManager1.register(user1);
        System.out.println();
        userManager1.register(user1);

        System.out.println("\n2--- login test - after registration");
        userManager1.login(user1.getEmail(),user1.getPassword());

        System.out.println("\n3--- update test - no changes");
        userManager1.update(user1);

        System.out.println("\n4--- update test - another user");
        userManager1.update(user2);

        System.out.println("\n5--- update test - name change");
        user1.setFirstName("Another User");
        userManager1.update(user1);

        System.out.println("\n6--- update test - e-mail change");
        user1.setEmail("example@gmail.com");
        userManager1.update(user1);

        System.out.println("\n7--- delete test");
        userManager1.delete(user1);

        System.out.println("\n8--- update test - after deletion");
        userManager1.update(user1);

        System.out.println();
        System.out.println();

        //register and login via google
        System.out.println("GOOGLE");
        UserManager userManager2 = new UserManager(new HibernateUserDao(), new UserCheckManager(new GoogleAuthManagerAdapter()), new EmailManager());
        userManager2.register(user3);
        System.out.println();
        userManager2.login(user3.getEmail(), user3.getPassword());

    }
}
