package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.OrderCreateRequestDto;
import com.driport.driport_backend.dto.OrderSummaryDto;

public interface IOrderService {

    OrderSummaryDto createOrder(OrderCreateRequestDto orderCreateRequestDto);

}

