package com.koriebruh.be.dto;

import com.koriebruh.be.entity.Delivery;
import com.koriebruh.be.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TakeOverRequest {

    private String deliveryId;

    private String fromWorkerId;

    private String toWorkerId;

    private Long handoverAt;

    private String reason;

}
