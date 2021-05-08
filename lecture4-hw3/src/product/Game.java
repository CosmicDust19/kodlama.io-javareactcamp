package product;

import product.campaign.Campaign;

public class Game {
    private int id;
    private String name;
    private double unitPrice;
    private String detail = null;
    private Campaign[] campaigns = null;

    public Game(int id, String name, double unitPrice) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
    }

    public Game(int id, String name, double unitPrice, String detail) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
        this.detail = detail;
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

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public double getUnitPriceAfterCampaigns() {
        double unitPriceAfterCampaigns = unitPrice;
        for (Campaign campaign: campaigns){
            unitPriceAfterCampaigns = unitPrice - (unitPrice * campaign.getDiscount() / 100);
        }
        return unitPriceAfterCampaigns;
    }

    public Campaign[] getCampaigns() {
        return campaigns;
    }

    public void setCampaigns(Campaign[] campaigns) {
        this.campaigns = campaigns;
    }


}
