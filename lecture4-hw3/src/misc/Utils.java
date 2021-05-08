package misc;

import log.Logger;
import user.User;

public class Utils {
    public static void runLoggers(Logger[] loggers, User user){
        for (Logger logger: loggers){
            logger.log(user);
        }
    }
}
