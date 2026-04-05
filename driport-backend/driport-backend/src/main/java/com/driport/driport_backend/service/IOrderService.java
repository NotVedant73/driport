package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.OrderCreateRequestDto;
import com.driport.driport_backend.dto.CustomerOrderDto;
import com.driport.driport_backend.dto.OrderSummaryDto;

import java.util.List;

public interface IOrderService {

    OrderSummaryDto createOrder(OrderCreateRequestDto orderCreateRequestDto);

    List<CustomerOrderDto> getMyOrders(String customerEmail);

}
