package product.campaign;

public class Campaign {
    private int id;
    private String name;
    private double discount = 0;
    private String slogan;
    private String detail;

    public Campaign(int id) {
        this.id = id;
    }

    public Campaign(int id, String name, int discount) {
        this.id = id;
        this.name = name;
        this.discount = discount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public String getSlogan() {
        return slogan;
    }

    public void setSlogan(String slogan) {
        this.slogan = slogan;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}
