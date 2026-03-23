package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminCouponUpsertDto;
import com.driport.driport_backend.entiity.Coupon;
import com.driport.driport_backend.service.IAdminCouponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    private final IAdminCouponService adminCouponService;

    public AdminCouponController(IAdminCouponService adminCouponService) {
        this.adminCouponService = adminCouponService;
    }

    @GetMapping
    public List<Coupon> getCoupons() {
        return adminCouponService.getAllCoupons();
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody AdminCouponUpsertDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminCouponService.createCoupon(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody AdminCouponUpsertDto dto) {
        return ResponseEntity.ok(adminCouponService.updateCoupon(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        adminCouponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
