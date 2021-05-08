package product.campaign;

import product.Game;

public interface CampaignService {
    void applyCampaign(Game game, Campaign campaign);

    void updateCampaign(Game game, Campaign campaign);

    void removeCampaign(Game game, Campaign campaign);
}
