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

import com.koriebruh.be.entity.DeliverAlert;
import com.koriebruh.be.entity.Enum.DeliverAlertType;
import com.koriebruh.be.entity.Position;
import com.koriebruh.be.entity.Truck;
import com.koriebruh.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    public void getDeliveryStatus(String deliveryId) {

    }

}
