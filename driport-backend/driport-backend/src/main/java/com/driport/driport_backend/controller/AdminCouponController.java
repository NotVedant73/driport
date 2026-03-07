package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminCouponUpsertDto;
import com.driport.driport_backend.entiity.Coupon;
import com.driport.driport_backend.repository.CouponRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/coupons")
public class AdminCouponController {

    private final CouponRepository couponRepository;

    public AdminCouponController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping
    public List<Coupon> getCoupons() {
        return couponRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody AdminCouponUpsertDto dto) {
        Coupon coupon = new Coupon();
        applyDto(coupon, dto);
        coupon.setUsedCount(0);
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable("id") Long id, @RequestBody AdminCouponUpsertDto dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with id: " + id));
        applyDto(coupon, dto);
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable("id") Long id) {
        if (!couponRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        couponRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyDto(Coupon coupon, AdminCouponUpsertDto dto) {
        if (dto.getCode() == null || dto.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Coupon code is required");
        }
        if (dto.getType() == null || dto.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Coupon type is required");
        }
        if (dto.getValue() == null) {
            throw new IllegalArgumentException("Coupon value is required");
        }

        coupon.setCode(dto.getCode().trim().toUpperCase());
        coupon.setType(dto.getType().trim().toUpperCase());
        coupon.setValue(dto.getValue());
        coupon.setActive(dto.getActive() != null ? dto.getActive() : Boolean.TRUE);
        coupon.setStartAt(dto.getStartAt());
        coupon.setEndAt(dto.getEndAt());
        coupon.setMinOrderAmount(dto.getMinOrderAmount());
        coupon.setUsageLimit(dto.getUsageLimit());
        if (coupon.getUsedCount() == null) {
            coupon.setUsedCount(0);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        String msg = ex.getMessage() == null ? "Bad request" : ex.getMessage();
        if (msg.toLowerCase().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
}

