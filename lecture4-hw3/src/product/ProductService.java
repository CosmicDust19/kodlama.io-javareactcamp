package product;

import user.User;

public interface ProductService {
    void addToCart(Game game, User user);

    void removeFromCart(Game game, User user);

}
