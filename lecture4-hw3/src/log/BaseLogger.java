package log;

import user.User;

public abstract class BaseLogger implements Logger{
    @Override
    public void log(User user) {
        //Common areas
        System.out.println("Logged");
    }
}
