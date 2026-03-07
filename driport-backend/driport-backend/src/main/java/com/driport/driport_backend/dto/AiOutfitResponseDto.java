package com.driport.driport_backend.dto;

import java.util.List;

public class AiOutfitResponseDto {
    private String occasion;
    private String vibe;
    private List<AiOutfitDto> outfits;

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public String getVibe() {
        return vibe;
    }

    public void setVibe(String vibe) {
        this.vibe = vibe;
    }

    public List<AiOutfitDto> getOutfits() {
        return outfits;
    }

    public void setOutfits(List<AiOutfitDto> outfits) {
        this.outfits = outfits;
    }
}
