package log;

import user.User;

public class EmailLogger extends BaseLogger{
    @Override
    public void log(User user) {
        System.out.println("Email has been sent: " + user.getFirstName());
    }
}
