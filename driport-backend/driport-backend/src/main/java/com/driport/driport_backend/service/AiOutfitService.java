package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AiOutfitItemDto;
import com.driport.driport_backend.dto.AiOutfitResponseDto;
import com.driport.driport_backend.dto.AiOutfitDto;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiOutfitService {

    private static final List<String> OUTFIT_ORDER = List.of("TOP", "BOTTOM", "OUTERWEAR", "SHOES", "ACCESSORY");

    private final ProductRepository productRepository;

    public AiOutfitService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public AiOutfitResponseDto generateOutfits(String occasion, String vibe) {
        AiOutfitResponseDto response = new AiOutfitResponseDto();
        response.setOccasion(occasion != null ? occasion.trim() : "");
        response.setVibe(vibe != null ? vibe.trim() : "");

        String occ = normalize(response.getOccasion());
        String vib = normalize(response.getVibe());

        List<Product> all = productRepository.findAll().stream()
                .filter(p -> p.getActive() == null || Boolean.TRUE.equals(p.getActive()))
                .collect(Collectors.toList());

        List<Product> filtered = all.stream()
                .filter(p -> matchesTags(p, occ, vib))
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            filtered = all.stream()
                    .filter(p -> matchesTagsRelaxed(p, occ, vib))
                    .collect(Collectors.toList());
        }
        if (filtered.isEmpty()) {
            filtered = all;
        }

        Map<String, List<Product>> byType = filtered.stream()
                .filter(p -> p.getType() != null && !p.getType().trim().isEmpty())
                .collect(Collectors.groupingBy(p -> p.getType().trim().toUpperCase(), Collectors.toList()));

        if (byType.isEmpty() && !filtered.isEmpty()) {
            byType.put("ACCESSORY", new ArrayList<>(filtered));
        }

        List<AiOutfitDto> outfits = new ArrayList<>();
        List<AiOutfitItemDto> items = new ArrayList<>();
        Set<Long> usedIds = new HashSet<>();

        for (String type : OUTFIT_ORDER) {
            List<Product> candidates = byType.getOrDefault(type, Collections.emptyList());
            Product pick = candidates.stream()
                    .filter(p -> !usedIds.contains(p.getId()))
                    .findFirst()
                    .orElse(null);
            if (pick == null) continue;

            usedIds.add(pick.getId());
            AiOutfitItemDto item = new AiOutfitItemDto();
            item.setRole(type);
            item.setProductId(pick.getId());
            item.setName(pick.getName());
            item.setImage(pick.getImage());
            item.setPrice(pick.getPrice());
            item.setCategory(pick.getCategory());
            items.add(item);
        }

        if (items.isEmpty()) {
            response.setOutfits(outfits);
            return response;
        }

        AiOutfitDto singleOutfit = new AiOutfitDto();
        singleOutfit.setId("outfit-1");
        singleOutfit.setItems(items);
        singleOutfit.setExplanation(buildExplanation(items, response.getVibe(), response.getOccasion()));
        outfits.add(singleOutfit);
        response.setOutfits(outfits);

        return response;
    }

    private static String normalize(String s) {
        if (s == null || s.trim().isEmpty()) return "";
        return s.trim().toLowerCase();
    }

    private static boolean matchesTags(Product p, String occasion, String vibe) {
        boolean occMatch = occasion.isEmpty() || tagsContain(p.getOccasionTags(), occasion) || tagsContain(p.getStyleTags(), occasion);
        boolean vibeMatch = vibe.isEmpty() || tagsContain(p.getStyleTags(), vibe) || tagsContain(p.getOccasionTags(), vibe);
        return occMatch && vibeMatch;
    }

    private static boolean matchesTagsRelaxed(Product p, String occasion, String vibe) {
        return tagsContain(p.getOccasionTags(), occasion) || tagsContain(p.getStyleTags(), vibe)
                || tagsContain(p.getCategory(), occasion) || tagsContain(p.getCategory(), vibe);
    }

    private static boolean tagsContain(String tags, String term) {
        if (tags == null || term.isEmpty()) return false;
        return tags.toLowerCase().contains(term.toLowerCase());
    }

    private static String buildExplanation(List<AiOutfitItemDto> items, String vibe, String occasion) {
        if (items.isEmpty()) return "Curated outfit for you.";
        String vibeStr = vibe != null && !vibe.isEmpty() ? vibe : "stylish";
        String occStr = occasion != null && !occasion.isEmpty() ? occasion : "any occasion";
        String names = items.stream()
                .map(AiOutfitItemDto::getName)
                .collect(Collectors.joining(", "));
        return String.format("This %s creates a %s look perfect for %s.", names, vibeStr, occStr);
    }
}
