package com.koriebruh.be.service;


import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.dto.RouteResponse;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.entity.Route;
import com.koriebruh.be.repository.CityRepository;
import com.koriebruh.be.repository.RouteRepository;
import com.koriebruh.be.utils.GeoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private CityRepository cityRepository;


    public String createRoute(RouteRequest request) {
        validationService.validate(request);

        City startCity = cityRepository.findById(request.getStartCityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find start city with id: " + request.getStartCityId()));

        City endCity = cityRepository.findById(request.getEndCityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find end city with id: " + request.getEndCityId()));


        Double distanceKM = GeoUtils.calculateDistance(
                startCity.getLatitude(),
                startCity.getLongitude(),
                endCity.getLatitude(),
                endCity.getLongitude()
        );

        /* Speed rata-rata truck pengiriman (km/jam)
         * Tambahan faktor untuk istirahat, loading/unloading, dll
         */
        final Double AVERAGE_TRUCK_SPEED = 55.0;
        final Double TIME_BUFFER_FACTOR = 1.3; // 30% buffer
        Double estimatedDurationHours = (distanceKM / AVERAGE_TRUCK_SPEED) * TIME_BUFFER_FACTOR;

        // Minimal 1 jam untuk jarak dekat
        if (estimatedDurationHours < 1.0) {
            estimatedDurationHours = 1.0;
        }

        Route newRoute = new Route();
        newRoute.setStartCity(startCity);
        newRoute.setEndCity(endCity);
        newRoute.setDetails(request.getDetails());
        newRoute.setBasePrice(request.getBasePrice());
        newRoute.setDistanceKM(distanceKM);
        newRoute.setEstimatedDurationHours(estimatedDurationHours);
        newRoute.setIsActive(request.getIsActive());
        newRoute.setCreatedAt(System.currentTimeMillis());

        routeRepository.save(newRoute);
        return "created route successfully";
    }


    public RouteResponse getRouteById(String routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        RouteResponse response = new RouteResponse();
        response.setId(route.getId());
        response.setStartCityName(route.getStartCity().getName());
        response.setEndCityName(route.getEndCity().getName());
        response.setDetails(route.getDetails());
        response.setBasePrice(route.getBasePrice());
        response.setDistanceKM(route.getDistanceKM());
        response.setEstimatedDurationHours(route.getEstimatedDurationHours());
        response.setIsActive(route.getIsActive());
        response.setCreatedAt(route.getCreatedAt());

        return response;
    }


    public String deleteRoute(String routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        route.setIsActive(false); // if status false mean "archived"
        routeRepository.save(route);
        return "Route deleted successfully";
    }


    public String updateRoute(String routeId, RouteRequest request) {
        validationService.validate(request);

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        City startCity = cityRepository.findById(request.getStartCityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find start city with id: " + request.getStartCityId()));

        City endCity = cityRepository.findById(request.getEndCityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find end city with id: " + request.getEndCityId()));

        Double distanceKM = GeoUtils.calculateDistance(
                startCity.getLatitude(),
                startCity.getLongitude(),
                endCity.getLatitude(),
                endCity.getLongitude()
        );

        /* Speed rata-rata truck pengiriman (km/jam)
         * Tambahan faktor untuk istirahat, loading/unloading, dll
         */
        final Double AVERAGE_TRUCK_SPEED = 55.0;
        final Double TIME_BUFFER_FACTOR = 1.3; // 30% buffer
        Double estimatedDurationHours = (distanceKM / AVERAGE_TRUCK_SPEED) * TIME_BUFFER_FACTOR;

        // Minimal 1 jam untuk jarak dekat
        if (estimatedDurationHours < 1.0) {
            estimatedDurationHours = 1.0;
        }

        route.setStartCity(startCity);
        route.setEndCity(endCity);
        route.setDetails(request.getDetails());
        route.setBasePrice(request.getBasePrice());
        route.setDistanceKM(distanceKM);
        route.setEstimatedDurationHours(estimatedDurationHours);
        route.setIsActive(request.getIsActive());

        routeRepository.save(route);
        return "Route updated successfully";
    }

    public List<RouteResponse> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return routes.stream().map(route -> RouteResponse.builder()
                .id(route.getId())
                .startCityName(route.getStartCity().getName())
                .endCityName(route.getEndCity().getName())
                .details(route.getDetails())
                .basePrice(route.getBasePrice())
                .distanceKM(route.getDistanceKM())
                .estimatedDurationHours(route.getEstimatedDurationHours())
                .isActive(route.getIsActive())
                .createdAt(route.getCreatedAt())
                .build()
        ).toList();
    }

}
