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
            @RequestParam(value = "occasion", defaultValue = "") String occasion,
            @RequestParam(value = "vibe", defaultValue = "") String vibe) {
        return aiOutfitService.generateOutfits(occasion, vibe);
    }
}
