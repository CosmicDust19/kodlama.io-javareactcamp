package user;

public interface UserService {
    void save(User user);

    void saveMulti(User[] users);

    void delete(User user);

    void saveChanges(User user);

    void changeUserInfo(User user);

    void completeShopping(User user);
}
