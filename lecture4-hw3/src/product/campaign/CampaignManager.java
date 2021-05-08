package product.campaign;

import product.Game;

public class CampaignManager implements CampaignService {
    @Override
    public void applyCampaign(Game game, Campaign campaign) {
        System.out.println("Applied: " + campaign.getName());
    }

    @Override
    public void updateCampaign(Game game, Campaign campaign) {
        System.out.println("Updated: " + campaign.getName());
    }

    @Override
    public void removeCampaign(Game game, Campaign campaign) {
        System.out.println("Removed: " + campaign.getName());
    }
}
