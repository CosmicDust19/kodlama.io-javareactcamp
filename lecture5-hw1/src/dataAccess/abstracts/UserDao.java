package dataAccess.abstracts;

import entities.concretes.User;

import java.util.List;

public interface UserDao {
    void add(User user);

    void update(User user);

    void delete(User user);

    User getById(int id);

    User getByEmail(String email);

    List<User> getAll();
}
