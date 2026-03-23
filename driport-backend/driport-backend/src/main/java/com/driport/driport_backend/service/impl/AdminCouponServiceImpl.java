package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminCouponUpsertDto;
import com.driport.driport_backend.entiity.Coupon;
import com.driport.driport_backend.exception.ResourceNotFoundException;
import com.driport.driport_backend.repository.CouponRepository;
import com.driport.driport_backend.service.IAdminCouponService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminCouponServiceImpl implements IAdminCouponService {

    private final CouponRepository couponRepository;

    public AdminCouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon createCoupon(AdminCouponUpsertDto dto) {
        Coupon coupon = new Coupon();
        applyDto(coupon, dto);
        coupon.setUsedCount(0);
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Long id, AdminCouponUpsertDto dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
        applyDto(coupon, dto);
        return couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon", id);
        }
        couponRepository.deleteById(id);
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
}
