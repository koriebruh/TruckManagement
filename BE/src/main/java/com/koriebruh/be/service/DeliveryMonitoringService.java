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

import com.koriebruh.be.dto.DeliveryRequest;
import com.koriebruh.be.dto.DeliveryResponse;
import com.koriebruh.be.dto.PositionRequest;
import com.koriebruh.be.entity.*;
import com.koriebruh.be.entity.Enum.DeliverAlertType;
import com.koriebruh.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryMonitoringService {

    //    @Autowired
//    private DeliverAlertRepository deliverAlertRepo;
//
//    @Autowired
//    private PositionRepository positionRepo;
//
//    @Autowired
//    private TruckRepository truckRepo;
// NANTI
    @Scheduled(fixedRate = 300_000)
    public void detectLostGPS() {

//        List<Truck> trucks = truckRepo.findAllByIsAvailableTrue();
//
//        for (Truck truck : trucks) {
//            Position latest = positionRepo.findTopByTruckIdOrderByCreatedAtDesc(truck.getId());
//
//            // if in 10 minutes no GPS update, send alert
//            if (latest == null || latest.getRecordedAt() < Instant.now().getEpochSecond() - 600) {
//                DeliverAlert alert = new DeliverAlert();
//                alert.setDelivery(latest.getDelivery());
//                alert.setType(DeliverAlertType.GPS_LOST);
//                alert.setMessage("No GPS update in the last 10 minutes.");
//                alert.setCreatedAt(Instant.now().getEpochSecond());
//                deliverAlertRepo.save(alert);
//            }
//
//            // if truck is not moving for 10 minutes, send alert
//
//
//        }

    }

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

    // get delivery detail
    // get /delivery/{deliveryId}
//    public DeliveryResponse getDeliveryDetail(String deliveryId) {
//
//    }

    // make delivery
    // post /delivery/create
    public String createDelivery(DeliveryRequest request) {

        Truck truck = truckRepo.findById(request.getTruckId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        Route route = routeRepo.findById(request.getRouteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        User worker = workerRepo.findById(request.getWorkerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        Delivery delivery = new Delivery();
        delivery.setTrucks(truck);
        delivery.setRoute(route);
        delivery.setWorker(worker);
        delivery.setStartedAt(Instant.now().getEpochSecond());
        deliveryRepo.save(delivery);

        return "Delivery created successfully with ID: " + delivery.getId();
    }


    // finished delivery
    // post /delivery/finish/{deliveryId}
    public String finishDelivery(String deliveryId) {

        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));

        if (delivery.getFinishedAt() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delivery has already been finished");
        }

        delivery.setFinishedAt(Instant.now().getEpochSecond());
        deliveryRepo.save(delivery);

        return "Delivery with ID: " + deliveryId + " has been finished successfully.";
    }


    // for real-time position updates from the delivery truck
    // post /delivery/position
    public String sendPosition(PositionRequest request) {

        Delivery delivery = deliveryRepo.findById(request.getDeliveryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));


        if (delivery.getFinishedAt() != null) {
            throw new IllegalStateException("Delivery has already been finished");
        }

        Position position = new Position();
        position.setDelivery(delivery);
        position.setLatitude(request.getLatitude());
        position.setLongitude(request.getLongitude());
        position.setRecordedAt(request.getRecordedAt());
        positionRepo.save(position);

        return "Position updated successfully for delivery ID: " + request.getDeliveryId();
    }

    // get all position of a deliveryId
    // get /delivery/position/{deliveryId}
    public String getPositions(String deliveryId) {
        // This method will return the position history of a truck
        // based on the truckId provided.
        // It will fetch the position history from the database
        // and return it in a suitable format.
        return "Position history for truck with ID: " + deliveryId;
    }


    // get last deliveries in the last 30 minutes
    // get /delivery/position/{deliveryId}/last



    // get all deliveries in process, usage condition where not finished
    // get /delivery/in-process


    // get delivery history
    // get /delivery/history
}
