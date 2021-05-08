package product;

import user.User;

public class GameManager implements ProductService {
    @Override
    public void addToCart(Game game, User user) {
        System.out.println("Added to cart: " + game.getName());
    }

    public void removeFromCart(Game game, User user){
        System.out.println("Removed from cart: " + game.getName());
    }
}
