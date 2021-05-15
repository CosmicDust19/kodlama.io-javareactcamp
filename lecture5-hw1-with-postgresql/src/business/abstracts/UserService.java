package business.abstracts;

import entities.concretes.User;

public interface UserService {

    void login(String email, String password);

    void register(User user);

    void update(int id, User user);

    void delete(int userId);
}
