package log;

import user.User;

public class FileLogger extends BaseLogger{
    @Override
    public void log(User user) {
        System.out.println("File has been logged: " + user.getFirstName());
    }
}
