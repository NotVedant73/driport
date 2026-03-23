package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AiOutfitResponseDto;
import com.driport.driport_backend.service.AiOutfitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/ai")
public class AiRecommendationController {

    private final AiOutfitService aiOutfitService;

    public AiRecommendationController(AiOutfitService aiOutfitService) {
        this.aiOutfitService = aiOutfitService;
    }

    @GetMapping("/outfit")
    public AiOutfitResponseDto getOutfit(
            @RequestParam(value = "fitType", required = false) String fitType,
            @RequestParam(value = "occasion", required = false) String legacyOccasion,
            @RequestParam(value = "vibe", defaultValue = "") String vibe) {

        String effectiveFit = (fitType != null && !fitType.isBlank())
                ? fitType
                : (legacyOccasion != null ? legacyOccasion : "");

        return aiOutfitService.generateOutfits(effectiveFit, vibe);
    }

    @GetMapping("/complete-fit")
    public AiOutfitResponseDto completeFit(@RequestParam("productId") Long productId) {
        return aiOutfitService.generateCompleteFit(productId);
    }
}
