package com.koriebruh.be.controller;

import com.koriebruh.be.dto.*;
import com.koriebruh.be.service.DeliveryMonitoringService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryMonitoringController {

    @Autowired
    private DeliveryMonitoringService deliveryMonitoringService;

    @PostMapping(
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> createDelivery(@RequestBody @Valid DeliveryRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        String msg = deliveryMonitoringService.createDelivery(request, username);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build() // ← ini yang sebelumnya hilang
        );
    }

    @PatchMapping(value = "/finish",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> finishDelivery() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        String msg = deliveryMonitoringService.finishDelivery(username);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("FINISHED")
                        .data(msg)
                        .build()
        );
    }

    @PostMapping(value = "/position",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updatePosition(@RequestBody @Valid PositionRequest positionRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        String msg = deliveryMonitoringService.sendPosition(positionRequest, username);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("UPDATED")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/detail",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<DeliveryDetailResponse>> getDeliveryDetail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        DeliveryDetailResponse deliveryDetailResponse = deliveryMonitoringService.getDeliveryDetail(username);
        return ResponseEntity.ok(
                WebResponse.<DeliveryDetailResponse>builder()
                        .status("OK")
                        .data(deliveryDetailResponse)
                        .build()
        );
    }

    @GetMapping(value = "/active",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryDetailResponse>>> getActiveDeliveries() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<DeliveryDetailResponse> activeDeliveries = deliveryMonitoringService.getAllActiveDeliveries();
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryDetailResponse>>builder()
                        .status("OK")
                        .data(activeDeliveries)
                        .build()
        );
    }

    @GetMapping(value = "/positions",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<PositionResponse>>> getPositions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<PositionResponse> positions = deliveryMonitoringService.getPositions(username);
        return ResponseEntity.ok(
                WebResponse.<List<PositionResponse>>builder()
                        .status("OK")
                        .data(positions)
                        .build()
        );
    }

    @GetMapping(value = "/positions/latest",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<PositionResponse>> getPositionsLatest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        PositionResponse positions = deliveryMonitoringService.getLastPosition(username);

        return ResponseEntity.ok(
                WebResponse.<PositionResponse>builder()
                        .status("OK")
                        .data(positions)
                        .build()
        );
    }

    @PostMapping(value = "/transit",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deliveryDoTransit(@RequestBody @Valid DoTransitRequest transitRequest) {
        String msg = deliveryMonitoringService.doTransit(transitRequest);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("TRANSIT")
                        .data(msg)
                        .build()
        );
    }


}
