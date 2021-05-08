import log.*;
import user.*;
import user.check.*;

import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {

        User user = new User(1,1, "Muhittin", "Topalak", "12345678900",
                LocalDate.of(1976, 7, 28), "CosmicDust19", "12345");

        BaseUserManager userManager = new UserManager(new MernisServiceAdapter(), new Logger[]{new DatabaseLogger(), new FileLogger()});

        userManager.save(user);
    }
}
