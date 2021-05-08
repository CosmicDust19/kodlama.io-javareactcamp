public class UserManager {

    public void add(User user){
        System.out.println(user.getName() + " Saved.");
    }

    public void changePassword(User user, String password){
        user.setPassword(password);
    }

}
