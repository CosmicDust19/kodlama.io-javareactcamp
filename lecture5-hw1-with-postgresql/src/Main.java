
import business.concretes.UserCheckManager;
import business.concretes.UserManager;
import core.concretes.EmailManager;
import dataAccess.concretes.HibernateUserDao;
import entities.concretes.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;


public class Main {
    public static void main(String[] args) {

        // Change this fields according to your database
        String databaseName = "e_commerce";
        String url = "jdbc:postgresql://localhost:5432/" + databaseName;
        String username = "postgres";
        String password = "12345";

        Statement statement = null;

        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            if (connection != null){
                System.out.println("Connected to " + url.split("/")[url.split("/").length - 1] + " database\n");
                statement = connection.createStatement();
            } else System.out.println("Something's wrong...");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        //-------------------------

        User user1 = new User("User", "User", "example@example.com", "123456");
        User user2 = new User("AnotherUser", "AnotherUser", "examle@exmple.com", "12345");
        User user3 = new User();

        UserManager userManager = new UserManager(new HibernateUserDao(statement), new UserCheckManager(), new EmailManager());

        System.out.println("\n1--- register test");
        userManager.register(user1);
        System.out.println();
        userManager.register(user1);
        System.out.println();
        userManager.register(user2);

        System.out.println("\n2--- update test");
        user1.setEmail("example@fasd.com");
        userManager.update(2, user1);

        System.out.println("\n3--- deletion test");
        userManager.delete(2);
    }
}
