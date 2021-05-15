package dataAccess.abstracts;




import entities.concretes.User;

import java.sql.ResultSet;
import java.sql.SQLException;

public interface UserDao {
    void add(User user) throws SQLException;

    void update(int id, User user) throws SQLException;

    void delete(int userId) throws SQLException;

    User getById(int id);

    User getByEmail(String email);

    ResultSet getAll();
}
