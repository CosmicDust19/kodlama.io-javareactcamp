package log;

import user.User;

public class DatabaseLogger extends BaseLogger{
    @Override
    public void log(User user) {
        System.out.println("Saved to database: " + user.getFirstName());
    }
}
