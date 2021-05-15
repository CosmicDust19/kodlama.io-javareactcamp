package dataAccess.concretes;

import dataAccess.abstracts.UserDao;
import entities.concretes.User;

import java.sql.*;

public class HibernateUserDao implements UserDao {

    private final Statement statement;

    public HibernateUserDao(Statement statement) {
        this.statement = statement;
    }

    @Override
    public void add(User user) throws SQLException {
        String sql = "insert into users (first_name,last_name,email,password) values " +
                "('" + user.getFirstName() + "','" + user.getLastName() + "','" + user.getEmail() + "','" + user.getPassword() + "')";
        statement.executeUpdate(sql);
        System.out.println("Saved to database by hibernate: " + user.getEmail());
    }

    @Override
    public void update(int id, User user) throws SQLException {
        String sql = "update users set first_name = '" + user.getFirstName() + "' , last_name = '" + user.getLastName()
                + "' , email = '" + user.getEmail() + "', password = '" + user.getPassword() + "' where id = " + id;
        statement.executeUpdate(sql);
        System.out.println("Updated by hibernate: " + user.getEmail());
    }

    @Override
    public void delete(int id) throws SQLException {
        String sql = "delete from users where id = " + id;
        statement.execute(sql);
        System.out.println("Deleted by hibernate.\nDeleted user id: " + id);
    }

    @Override
    public User getById(int id) {
        String sql = "select * from users where id = " + id;
        String firstName = null, lastName = null, email = null, password = null;
        try {
            ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                firstName = resultSet.getString(2);
                lastName = resultSet.getString(3);
                email = resultSet.getString(4);
                password = resultSet.getString(5);
            }
            return new User(id, firstName, lastName, email, password);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    @Override
    public User getByEmail(String email) {
        String sql = "select * from users where email = '" + email + "'";
        ResultSet resultSet;
        int id = -1;
        String firstName = null, lastName = null, password = null;
        try {
            resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                id = resultSet.getInt(1);
                firstName = resultSet.getString(2);
                lastName = resultSet.getString(3);
                password = resultSet.getString(5);
            }
            return new User(id, firstName, lastName, email, password);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    @Override
    public ResultSet getAll() {
        try {
            return statement.executeQuery("select * from users");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }
}

