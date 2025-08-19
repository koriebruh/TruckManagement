package com.koriebruh.be.service;

import com.koriebruh.be.entity.*;
import com.koriebruh.be.entity.Enum.DeliverAlertType;
import com.koriebruh.be.repository.*;
import com.koriebruh.be.utils.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Map;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetectionService {

    @Autowired
    private DeliveryRepository deliveryRepo;

    @Autowired
    private PositionRepository positionRepo;

    @Autowired
    private DeliverAlertRepository deliverAlertRepo;

    @Autowired
    private DeliveryTransitRepository deliveryTransitRepo;

    @Autowired
    private RouteRepository routeRepo;
//
//    @Scheduled(fixedRate = 1000 * 60 * 5) // Every 5 minutes
//    public void detectIssues() { // Ganti nama biar lebih umum
//        long now = Instant.now().getEpochSecond();
//        List<Delivery> activeDeliveries = deliveryRepo.findAllByFinishedAtIsNull();
//
//        for (Delivery delivery : activeDeliveries) {
//            Position latest = positionRepo.findTopByDeliveryIdOrderByRecordedAtDesc(delivery.getId());
//
//            // 1. GPS LOST CHECK (tetap sama)
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
//            // 2. ILLEGAL STOP CHECK - Transit Point Based (tetap sama)
//            DeliverAlert lastAlert = deliverAlertRepo.findTopByDeliveryIdOrderByCreatedAtDesc(delivery.getId());
//            if (lastAlert != null && lastAlert.getType() == DeliverAlertType.TRANSIT) {
//                DeliveryTransit lastTransit = deliveryTransitRepo.findTopByDeliveryIdOrderByArrivedAtDesc(delivery.getId());
//                if (lastTransit != null && lastTransit.getArrivedAt() < now - 2700) {
//                    DeliverAlert recentIllegal = deliverAlertRepo.findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(delivery.getId(), DeliverAlertType.ILLEGAL_STOP);
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
//            // 3. ILLEGAL STOP CHECK - GPS Location Based (tetap sama)
//            if (latest != null) {
//                Position oldPosition = positionRepo.findTopByDeliveryIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(delivery.getId(), now - 2700);
//                if (oldPosition != null) {
//                    boolean stayingSameLocation = GeoUtils.isWithinRadius(
//                            oldPosition.getLatitude(), oldPosition.getLongitude(),
//                            latest.getLatitude(), latest.getLongitude(),
//                            0.1 // 100 meter radius
//                    );
//                    if (stayingSameLocation) {
//                        DeliverAlert recentLocationIllegal = deliverAlertRepo.findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(delivery.getId(), DeliverAlertType.ILLEGAL_STOP);
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
//
//            // 4. UNAUTHORIZED LOADING CHECK - Geoapify Integration
//            if (latest != null) {
//                // Cek hari sejak started_at
//                long daysSinceStart = (now - delivery.getStartedAt()) / (24 * 3600);
//                if (daysSinceStart < 3) { // Hanya cek di hari 1-2
//                    // Cek idle 30 menit (kita kurangi dari 45 menit biar lebih ketat)
//                    Position oldPosition = positionRepo.findTopByDeliveryIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(delivery.getId(), now - 1800);
//                    if (oldPosition != null) {
//                        boolean isIdle = GeoUtils.isWithinRadius(
//                                oldPosition.getLatitude(), oldPosition.getLongitude(),
//                                latest.getLatitude(), latest.getLongitude(),
//                                0.1 // 100 meter
//                        );
//                        if (isIdle) {
//                            // Reverse Geocode posisi terbaru
//                            Map<String, Object> geoResult = reverseGeocode(latest.getLatitude(), latest.getLongitude());
//                            if (geoResult != null) {
//                                // Ambil city dari Geoapify
//                                Map<String, Object> properties = (Map<String, Object>) geoResult.get("properties");
//                                String cityName = (String) properties.get("city");
//                                if (cityName != null) {
//                                    // Cek apakah city match dengan loading_city dari route atau transit_points
//                                    Route route = routeRepo.findById(delivery.getRouteId()).orElse(null);
//                                    if (route != null) {
//                                        City loadingCity = cityRepo.findById(route.getStartId()).orElse(null);
//                                        if (loadingCity != null && cityName.equalsIgnoreCase(loadingCity.getName())) {
//                                            // Cek apakah ada transit baru untuk loading city ini
//                                            DeliveryTransit recentTransit = deliveryTransitRepo.findTopByDeliveryIdAndTransitPointIdLoadingCityIdAndIsAcceptedTrueOrderByArrivedAtDesc(
//                                                    delivery.getId(), route.getStartId());
//                                            if (recentTransit == null || recentTransit.getArrivedAt() < now - 1800) {
//                                                // Trigger alert
//                                                DeliverAlert unauthorizedAlert = new DeliverAlert();
//                                                unauthorizedAlert.setDelivery(delivery);
//                                                unauthorizedAlert.setType(DeliverAlertType.UNAUTHORIZED_LOADING);
//                                                unauthorizedAlert.setMessage(String.format(
//                                                        "Unauthorized loading detected at %s (%.6f, %.6f)",
//                                                        cityName, latest.getLatitude(), latest.getLongitude()));
//                                                unauthorizedAlert.setCreatedAt(now);
//                                                deliverAlertRepo.save(unauthorizedAlert);
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    }
//
//    private Map<String, Object> reverseGeocode(double lat, double lon) {
//        String url = String.format("https://api.geoapify.com/v1/geocode/reverse?lat=%f&lon=%f&apiKey=%s", lat, lon, GEOAPIFY_KEY);
//        try {
//            String response = restTemplate.getForObject(url, String.class);
//            ObjectMapper mapper = new ObjectMapper();
//            Map<String, Object> result = mapper.readValue(response, Map.class);
//            return (Map<String, Object>) ((List<?>) result.get("features")).get(0);
//        } catch (Exception e) {
//            // Log error
//            System.err.println("Geoapify error: " + e.getMessage());
//            return null;
//        }
//    }
}
