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
public class
AiOutfitService {

    private static final List<String> OUTFIT_ORDER = List.of("TOP", "BOTTOM", "OUTERWEAR", "SHOES", "ACCESSORY");

    private final ProductRepository productRepository;

    public AiOutfitService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public AiOutfitResponseDto generateOutfits(String fitType, String vibe) {
        AiOutfitResponseDto response = new AiOutfitResponseDto();
        // reuse "occasion" field to represent fit type label for now
        response.setOccasion(fitType != null ? fitType.trim() : "");
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

    public AiOutfitResponseDto generateCompleteFit(Long productId) {
        Product base = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        List<Product> all = productRepository.findAll().stream()
                .filter(p -> (p.getActive() == null || Boolean.TRUE.equals(p.getActive()))
                        && !p.getId().equals(base.getId()))
                .collect(Collectors.toList());

        String baseOcc = normalize(base.getOccasionTags());
        String baseVibe = normalize(base.getStyleTags());

        Map<String, List<Product>> byType = all.stream()
                .filter(p -> p.getType() != null && !p.getType().trim().isEmpty())
                .collect(Collectors.groupingBy(p -> p.getType().trim().toUpperCase(), Collectors.toList()));

        List<String> roles = new ArrayList<>();
        String baseType = base.getType() != null ? base.getType().trim().toUpperCase() : "";
        if (!baseType.isEmpty()) {
            roles.add(baseType);
        }
        if (!"TOP".equals(baseType)) roles.add("TOP");
        if (!"BOTTOM".equals(baseType)) roles.add("BOTTOM");
        if (!"OUTERWEAR".equals(baseType)) roles.add("OUTERWEAR");

        List<AiOutfitItemDto> items = new ArrayList<>();
        Set<Long> usedIds = new HashSet<>();

        for (String role : roles) {
            if (role.equals(baseType)) {
                AiOutfitItemDto baseItem = new AiOutfitItemDto();
                baseItem.setRole(role);
                baseItem.setProductId(base.getId());
                baseItem.setName(base.getName());
                baseItem.setImage(base.getImage());
                baseItem.setPrice(base.getPrice());
                baseItem.setCategory(base.getCategory());
                items.add(baseItem);
                usedIds.add(base.getId());
                continue;
            }

            List<Product> candidates = byType.getOrDefault(role, Collections.emptyList());
            Product pick = candidates.stream()
                    .sorted(Comparator.comparingInt((Product p) -> -scoreCompatibility(base, p, baseOcc, baseVibe)))
                    .filter(p -> !usedIds.contains(p.getId()))
                    .findFirst()
                    .orElse(null);

            if (pick == null) {
                continue;
            }

            usedIds.add(pick.getId());
            AiOutfitItemDto item = new AiOutfitItemDto();
            item.setRole(role);
            item.setProductId(pick.getId());
            item.setName(pick.getName());
            item.setImage(pick.getImage());
            item.setPrice(pick.getPrice());
            item.setCategory(pick.getCategory());
            items.add(item);
        }

        AiOutfitResponseDto response = new AiOutfitResponseDto();
        response.setOccasion("");
        response.setVibe("");

        if (items.isEmpty()) {
            response.setOutfits(Collections.emptyList());
            return response;
        }

        AiOutfitDto outfit = new AiOutfitDto();
        outfit.setId("complete-fit-" + productId);
        outfit.setItems(items);
        outfit.setExplanation(buildExplanation(items, baseVibe, baseOcc));
        response.setOutfits(List.of(outfit));
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

    private static int scoreCompatibility(Product base, Product candidate, String baseOcc, String baseVibe) {
        int score = 0;
        if (baseOcc != null && !baseOcc.isEmpty()) {
            if (tagsContain(candidate.getOccasionTags(), baseOcc)) score += 2;
        }
        if (baseVibe != null && !baseVibe.isEmpty()) {
            if (tagsContain(candidate.getStyleTags(), baseVibe)) score += 2;
        }
        if (base.getCategory() != null && candidate.getCategory() != null
                && candidate.getCategory().toLowerCase().contains(base.getCategory().toLowerCase())) {
            score += 1;
        }
        return score;
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
