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
        String operator = authentication.getName();

        String msg = deliveryMonitoringService.createDelivery(request, operator);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build() // ← ini yang sebelumnya hilang
        );
    }

    @PatchMapping(value = "/finish/{deliveryId}",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> finishDelivery(@PathVariable String deliveryId) {

        String msg = deliveryMonitoringService.finishDelivery(deliveryId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("FINISHED")
                        .data(msg)
                        .build()
        );
    }

    // NEWWW,
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

    // NEWWW
    @GetMapping(value = "/position/{workerId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<PositionGeoResponse>> getPositionByWorkerId(@PathVariable String workerId) {
        PositionGeoResponse position = deliveryMonitoringService.getPositionByWorkerId(workerId);

        return ResponseEntity.ok(
                WebResponse.<PositionGeoResponse>builder()
                        .status("OK")
                        .data(position)
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
    public ResponseEntity<WebResponse<List<AllDeliveryActiveResponse>>> getActiveDeliveries() {

        List<AllDeliveryActiveResponse> activeDeliveries = deliveryMonitoringService.getAllActiveDeliveries();
        return ResponseEntity.ok(
                WebResponse.<List<AllDeliveryActiveResponse>>builder()
                        .status("OK")
                        .data(activeDeliveries)
                        .build()
        );
    }

    @GetMapping(value = "/active/{workerId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<AllDeliveryActiveResponse>> getActiveDeliveriesByWorkerId(@PathVariable String workerId) {

        AllDeliveryActiveResponse activeDelivery = deliveryMonitoringService.getActiveDeliveriesByUserId(workerId);
        return ResponseEntity.ok(
                WebResponse.<AllDeliveryActiveResponse>builder()
                        .status("OK")
                        .data(activeDelivery)
                        .build()
        );
    }

    @GetMapping(value = "/positions/{deliveryId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<PositionGeoResponse>>> getPositions(@PathVariable String deliveryId) {
        List<PositionGeoResponse> positions = deliveryMonitoringService.getPositions(deliveryId);

        return ResponseEntity.ok(
                WebResponse.<List<PositionGeoResponse>>builder()
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

    @GetMapping(value = "/detail/{deliveryId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<DeliveryDetailResponse>> getDetailDeliveryById(@PathVariable String deliveryId) {
        DeliveryDetailResponse detail = deliveryMonitoringService.getDeliveryDetailById(deliveryId);

        return ResponseEntity.ok(
                WebResponse.<DeliveryDetailResponse>builder()
                        .status("OK")
                        .data(detail)
                        .build()
        );
    }


    @DeleteMapping(
            value = "/{deliveryId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteDelivery(@PathVariable String deliveryId) {
        deliveryMonitoringService.deleteDelivery(deliveryId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("DELETED")
                        .data("Delivery with ID " + deliveryId + " has been deleted.")
                        .build()
        );
    }

    @PatchMapping(value = "/transit/accept-or-reject",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> acceptOrRejectTransit(@RequestBody @Valid AccOrRejectTransitRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String operator = authentication.getName();

        String msg = deliveryMonitoringService.ApproveTransit(operator, request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("UPDATED")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/transit/pending",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<TransitPendingResponse>>> getPendingTransits() {
        List<TransitPendingResponse> pendingTransits = deliveryMonitoringService.getPendingTransitRequest();
        return ResponseEntity.ok(
                WebResponse.<List<TransitPendingResponse>>builder()
                        .status("OK")
                        .data(pendingTransits)
                        .build()
        );
    }

    @GetMapping(value = "/transit/{transitId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<TransitPendingDetail>> getTransitDetail(@PathVariable String transitId) {
        TransitPendingDetail transitDetail = deliveryMonitoringService.getTransitPendingDetailById(transitId);
        return ResponseEntity.ok(
                WebResponse.<TransitPendingDetail>builder()
                        .status("OK")
                        .data(transitDetail)
                        .build()
        );
    }

    @GetMapping(value = "/transit",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<TransitPendingDetail>>> getAllTransits() {
        List<TransitPendingDetail> allTransits = deliveryMonitoringService.getAllTransitPendingDetail();
        return ResponseEntity.ok(
                WebResponse.<List<TransitPendingDetail>>builder()
                        .status("OK")
                        .data(allTransits)
                        .build()
        );
    }


    @GetMapping(value = "/history",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryHistoryResponse>>> getDeliveryHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<DeliveryHistoryResponse> deliveryHistory = deliveryMonitoringService.getAllDeliveryHistory();
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryHistoryResponse>>builder()
                        .status("OK")
                        .data(deliveryHistory)
                        .build()
        );
    }

    @GetMapping(value = "/history/{workerId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryHistoryResponse>>> getDeliveryHistoryByWorkerId(@PathVariable String workerId) {
        List<DeliveryHistoryResponse> deliveryHistory = deliveryMonitoringService.getDeliveryHistoryByWorkerId(workerId);
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryHistoryResponse>>builder()
                        .status("OK")
                        .data(deliveryHistory)
                        .build()
        );
    }

    @PostMapping(value = "/takeover",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> takeOverDelivery(@RequestBody @Valid TakeOverRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String operator = authentication.getName();

        String msg = deliveryMonitoringService.takeOverDelivery(request, operator);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("TAKEN OVER")
                        .data(msg)
                        .build()
        );
    }


    @GetMapping(value = "/takeover",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryHandoverResponse>>> getAllTakeOverRequests() {
        List<DeliveryHandoverResponse> takeOverResponses = deliveryMonitoringService.getAllDeliveryHandovers();
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryHandoverResponse>>builder()
                        .status("OK")
                        .data(takeOverResponses)
                        .build()
        );
    }

    @GetMapping(value = "/takeover/{deliveryId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryHandoverResponse>>> getTakeOverRequestByDeliveryId(@PathVariable String deliveryId) {
        List<DeliveryHandoverResponse> takeOverResponse = deliveryMonitoringService.getDeliveryHandoversByDeliveryId(deliveryId);
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryHandoverResponse>>builder()
                        .status("OK")
                        .data(takeOverResponse)
                        .build()
        );
    }

    /**
     * Driver sends a manual notification/alert to admin and owner
     * POST /api/delivery/alert/send
     */
    @PostMapping(value = "/alert/send",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> sendDriverAlert(@RequestBody @Valid DeliveryAlertRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String driverUsername = authentication.getName();

        String msg = deliveryMonitoringService.sendDriverAlert(request, driverUsername);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("SENT")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/alert",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<DeliveryAlertDTO>>> getAllAlerts() {
        List<DeliveryAlertDTO> alerts = deliveryMonitoringService.getAllRecentAlerts();
        return ResponseEntity.ok(
                WebResponse.<List<DeliveryAlertDTO>>builder()
                        .status("OK")
                        .data(alerts)
                        .build()
        );
    }


}
