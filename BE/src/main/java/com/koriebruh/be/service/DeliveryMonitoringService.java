package com.koriebruh.be.service;

/* This function scheduler for monitoring
 * the delivery status of trucks and sending alerts
 * in case of illegal stops or GPS loss.
 * It will be used to ensure that deliveries are on track
 * and to notify relevant parties in case of issues.
 *
 * The service will periodically check the status of each truck,
 * update their delivery status, and send alerts if necessary.
 *
 * This service will be integrated with the existing delivery system
 * to provide real-time monitoring and alerting capabilities.
 * */

import com.koriebruh.be.dto.*;
import com.koriebruh.be.entity.*;
import com.koriebruh.be.entity.Enum.DeliverAlertType;
import com.koriebruh.be.entity.Enum.RoleType;
import com.koriebruh.be.repository.*;
import com.koriebruh.be.utils.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryMonitoringService {

    @Autowired
    private PositionRepository positionRepo;

    @Autowired
    private DeliveryRepository deliveryRepo;

    @Autowired
    private TruckRepository truckRepo;

    @Autowired
    private RouteRepository routeRepo;

    @Autowired
    private UserRepository workerRepo;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private DeliveryTransitRepository deliveryTransitRepo;

    @Autowired
    private TransitPointRepository transitPointRepo;

    @Autowired
    private DeliverAlertRepository deliverAlertRepo;

    @Autowired
    private UserRepository UserRepository;


//    @Scheduled(fixedRate = 300_000)
//    public void detectLostGPS() {
//        // CHECK DI DELIVERY
//        long now = Instant.now().getEpochSecond();
//        List<Delivery> activeDeliveries = deliveryRepo.findAllByFinishedAtIsNull();
//
//        for (Delivery delivery : activeDeliveries) {
//            Position latest = positionRepo.findTopByDeliveryIdOrderByRecordedAtDesc(delivery.getId());
//
//            // GPS LOST CHECK
//            if (latest == null || latest.getRecordedAt() < now - 600) {
//                DeliverAlert recent = deliverAlertRepo.findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(delivery.getId(), DeliverAlertType.GPS_LOST);
//                if (recent == null || recent.getCreatedAt() < now - 600) {
//                    DeliverAlert alert = new DeliverAlert();
//                    alert.setDelivery(delivery);
//                    alert.setType(DeliverAlertType.GPS_LOST);
//                    alert.setMessage("No GPS update in the last 10 minutes.");
//                    alert.setCreatedAt(now);
//                    deliverAlertRepo.save(alert);
//                }
//            }
//
//            // ILLEGAL STOP CHECK - Transit Point Based
//            DeliverAlert lastAlert = deliverAlertRepo.findTopByDeliveryIdOrderByCreatedAtDesc(delivery.getId());
//            if (lastAlert != null && lastAlert.getType() == DeliverAlertType.TRANSIT) {
//                DeliveryTransit lastTransit = deliveryTransitRepo.findTopByDeliveryIdOrderByArrivedAtDesc(delivery.getId());
//
//                if (lastTransit != null && lastTransit.getArrivedAt() < now - 2700) {
//                    DeliverAlert recentIllegal = deliverAlertRepo.findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(delivery.getId(), DeliverAlertType.ILLEGAL_STOP);
//
//                    if (recentIllegal == null || recentIllegal.getCreatedAt() < now - 2700) {
//                        DeliverAlert illegalStopAlert = new DeliverAlert();
//                        illegalStopAlert.setDelivery(delivery);
//                        illegalStopAlert.setType(DeliverAlertType.ILLEGAL_STOP);
//                        illegalStopAlert.setMessage("Illegal stop detected. No movement for more than 45 minutes.");
//                        illegalStopAlert.setCreatedAt(now);
//                        deliverAlertRepo.save(illegalStopAlert);
//                    }
//                }
//            }
//
//            // ILLEGAL STOP CHECK - GPS Location Based
//            if (latest != null) {
//                // Ambil posisi 45 menit yang lalu
//                Position oldPosition = positionRepo.findTopByDeliveryIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(delivery.getId(), now - 2700);
//
//                if (oldPosition != null) {
//                    // Check apakah masih dalam radius yang sama (100 meter)
//                    boolean stayingSameLocation = GeoUtils.isWithinRadius(
//                            oldPosition.getLatitude(), oldPosition.getLongitude(),
//                            latest.getLatitude(), latest.getLongitude(),
//                            0.1 // 100 meter radius
//                    );
//
//                    if (stayingSameLocation) {
//                        DeliverAlert recentLocationIllegal = deliverAlertRepo.findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(delivery.getId(), DeliverAlertType.ILLEGAL_STOP);
//
//                        if (recentLocationIllegal == null || recentLocationIllegal.getCreatedAt() < now - 2700) {
//                            DeliverAlert locationIllegalAlert = new DeliverAlert();
//                            locationIllegalAlert.setDelivery(delivery);
//                            locationIllegalAlert.setType(DeliverAlertType.ILLEGAL_STOP);
//                            locationIllegalAlert.setMessage(String.format(
//                                    "Vehicle stationary at same location for 45+ minutes. Location: (%.6f, %.6f)",
//                                    latest.getLatitude(), latest.getLongitude()));
//                            locationIllegalAlert.setCreatedAt(now);
//                            deliverAlertRepo.save(locationIllegalAlert);
//                        }
//                    }
//                }
//            }
//        }
//    }

    // make delivery
    // post /delivery/create
    public String createDelivery(DeliveryRequest request, String operator) {
        validationService.validate(request);
        Truck truck = truckRepo.findById(request.getTruckId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        Route route = routeRepo.findById(request.getRouteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        User operatorUser = workerRepo.findByUsernameAndDeletedAtIsNull(operator)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        User worker = workerRepo.findByUsernameAndDeletedAtIsNull(operator)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        // CEK STATUS DELIVERY SEBELUMNYA UDAH KELAR BELUM
        boolean isActive = deliveryRepo.existsByWorkerIdAndFinishedAtIsNull(worker.getId());
        if (isActive) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Worker already has an active delivery");
        }

        if (!truck.getIsAvailable()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Truck is not active");
        }

        if (!route.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Route is not active");
        }

        if (worker.getRole() != RoleType.DRIVER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "this is not a driver, can't create delivery");
        }

        Delivery delivery = new Delivery();
        delivery.setTrucks(truck);
        delivery.setRoute(route);
        delivery.setWorker(worker);
        delivery.setAddByOperatorId(operatorUser);
        delivery.setStartedAt(Instant.now().getEpochSecond());
        deliveryRepo.save(delivery);

        Position initialPosition = new Position();
        initialPosition.setDelivery(delivery);
        initialPosition.setLatitude(request.getLatitude());
        initialPosition.setLongitude(request.getLongitude());
        initialPosition.setRecordedAt(Instant.now().getEpochSecond());

        return "Delivery created successfully with ID: " + delivery.getId();
    }


    // finished delivery
    // post /delivery/finish/{deliveryId}
    public String finishDelivery(String deliveryId) {
        Delivery delivery = deliveryRepo.findByIdAndFinishedAtIsNull(deliveryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery has already been finished"));

        delivery.setFinishedAt(Instant.now().getEpochSecond());
        deliveryRepo.save(delivery);

        return deliveryId + " has been finished successfully delivery.";
    }


    // for real-time position updates from the delivery truck
    // post /delivery/position
    public String sendPosition(PositionRequest request, String username) {
        validationService.validate(request);

        Delivery delivery = deliveryRepo.findByWorkerUsernameAndFinishedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery has already finished. Position can't be add"));

        Position position = new Position();
        position.setDelivery(delivery);
        position.setLatitude(request.getLatitude());
        position.setLongitude(request.getLongitude());
        position.setRecordedAt(request.getRecordedAt());
        positionRepo.save(position);

        return "Position recorded successfully for delivery ID: " + delivery.getId();
    }

    // get detail of a delivery (buat worker)
    // get /delivery/detail/
    public DeliveryDetailResponse getDeliveryDetail(String username) {
        Delivery delivery = deliveryRepo.findByWorkerUsernameAndFinishedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "right now you don't have any active delivery"));

        //FINAL RESPONSE
        return DeliveryDetailResponse.builder()
                .id(delivery.getId())
                .workerId(delivery.getWorker().getId())
                .truckId(delivery.getTrucks().getId())
                .routeId(delivery.getRoute().getId())
                .startedAt(delivery.getStartedAt())
                .finishedAt(delivery.getFinishedAt())
                .alerts(delivery.getAlerts())
                .transits(delivery.getTransits())
                .build();
    }


    // get all active deliveries, nanti mungkin hanya owner yg bisa cek
    // get /delivery/active
    public List<AllDeliveryActiveResponse> getAllActiveDeliveries() {
        List<Delivery> activeDeliveries = deliveryRepo.findAllByFinishedAtIsNull();

        if (activeDeliveries.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No active deliveries found");
        }

        return activeDeliveries.stream()
                .map(delivery -> {
                    return AllDeliveryActiveResponse.builder()
                            .id(delivery.getId())
                            .workerId(delivery.getWorker().getId())
                            .truckId(delivery.getTrucks().getId())
                            .routeId(delivery.getRoute().getId())
                            .startedAt(delivery.getStartedAt())
                            .build();
                })
                .toList();
    }


    // get all position of a
    // get /delivery/position
    public List<PositionResponse> getPositions(String deliveryId) {

        List<Position> positions = positionRepo.findAllByDeliveryIdOrderByRecordedAtDesc(deliveryId);

        return positions.stream()
                .map(position -> PositionResponse.builder()
                        .latitude(position.getLatitude())
                        .longitude(position.getLongitude())
                        .recordedAt(position.getRecordedAt())
                        .build())
                .toList();
    }

    // get last deliveries position
    // get /delivery/position/{deliveryId}/last
    public PositionResponse getLastPosition(String username) {
        Delivery delivery = deliveryRepo.findByWorkerUsernameAndFinishedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No position found for this delivery bcs delivery has already finished"));

        Position lastPosition = positionRepo.findTopByDeliveryIdOrderByRecordedAtDesc(delivery.getId());

        return PositionResponse.builder()
                .latitude(lastPosition.getLatitude())
                .longitude(lastPosition.getLongitude())
                .recordedAt(lastPosition.getRecordedAt())
                .build();
    }

    // delivery do transit
    // /delivery/transit/
    public String doTransit(DoTransitRequest request) {
        validationService.validate(request);

        boolean isActive = deliveryRepo.existsByIdAndFinishedAtIsNull(request.getDeliveryId());
        if (!isActive) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delivery NotFound or has already finished");
        }

        Delivery delivery = deliveryRepo.findById(request.getDeliveryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));

        TransitPoint transitPoint = transitPointRepo.findById(request.getTransitPointId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit point not found"));


        DeliveryTransit deliveryTransit = new DeliveryTransit();
        deliveryTransit.setDelivery(delivery);
        deliveryTransit.setTransitPoint(transitPoint);
        deliveryTransit.setArrivedAt(Instant.now().getEpochSecond());
        deliveryTransitRepo.save(deliveryTransit); // save delivery to update transits

        return "Transit added successfully for delivery ID: " + request.getDeliveryId();
    }

    public DeliveryDetailResponse getDeliveryDetailById(String deliveryId) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "right now you don't have any active delivery"));

        //FINAL RESPONSE
        return DeliveryDetailResponse.builder()
                .id(delivery.getId())
                .workerId(delivery.getWorker().getId())
                .truckId(delivery.getTrucks().getId())
                .routeId(delivery.getRoute().getId())
                .startedAt(delivery.getStartedAt())
                .finishedAt(delivery.getFinishedAt())
                .alerts(delivery.getAlerts())
                .transits(delivery.getTransits())
                .build();
    }

    // delete delivery
    //
    @Transactional
    public String deleteDelivery(String deliveryId) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));

        if (delivery.getFinishedAt() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete a finished delivery");
        }

        // Delete all related positions, alerts, and transits
        positionRepo.deleteAllByDeliveryId(deliveryId);
        deliverAlertRepo.deleteAllByDeliveryId(deliveryId);
        deliveryTransitRepo.deleteAllByDeliveryId(deliveryId);
        deliveryTransitRepo.deleteAllByDeliveryId(deliveryId);
        deliveryRepo.delete(delivery);

        return "Delivery deleted successfully";
    }

    public String ApproveTransit(String operatorN, AccOrRejectTransitRequest request) {
        validationService.validate(request);
        User operatorUser = UserRepository.findByUsernameAndDeletedAtIsNull(operatorN)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operator not found"));

        DeliveryTransit deliveryTransit = deliveryTransitRepo.findById(request.getDeliveryTransitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit request not found"));

        if (deliveryTransit.getIsAccepted() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transit request has already been processed");
        }

        // Logic to accept the transit request
        if (request.getIsAccepted()) {
            deliveryTransit.setActionByOperatorId(operatorUser);
            deliveryTransit.setIsAccepted(true);
            deliveryTransit.setActionedAt(Instant.now().getEpochSecond());
            deliveryTransit.setReason(request.getReason());
            deliveryTransitRepo.save(deliveryTransit);
        } else {
            deliveryTransit.setActionByOperatorId(operatorUser);
            deliveryTransit.setIsAccepted(false);
            deliveryTransit.setActionedAt(Instant.now().getEpochSecond());
            deliveryTransit.setReason(request.getReason());
            deliveryTransitRepo.save(deliveryTransit);
        }

        return "Transit request " + (request.getIsAccepted() ? "accepted" : "rejected") + " successfully.";
    }


}
