package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AdminCouponUpsertDto;
import com.driport.driport_backend.entiity.Coupon;

import java.util.List;

public interface IAdminCouponService {
    List<Coupon> getAllCoupons();

    Coupon createCoupon(AdminCouponUpsertDto dto);

    Coupon updateCoupon(Long id, AdminCouponUpsertDto dto);

    void deleteCoupon(Long id);
}
