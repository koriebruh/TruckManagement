package com.koriebruh.be.service;


import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.dto.RouteResponse;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.entity.Route;
import com.koriebruh.be.repository.CityRepository;
import com.koriebruh.be.repository.RouteRepository;
import com.koriebruh.be.utils.Estimation;
import com.koriebruh.be.utils.GeoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CityService cityService;


    public String createRoute(RouteRequest request) {
        validationService.validate(request);

        City startCity = request.getStartCityId() != null 
                ? cityRepository.findById(request.getStartCityId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find start city with id: " + request.getStartCityId()))
                : cityService.findOrCreateCity(request.getStartCityName(), request.getStartCityLat(), request.getStartCityLon(), "Indonesia");

        City endCity = request.getEndCityId() != null
                ? cityRepository.findById(request.getEndCityId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find end city with id: " + request.getEndCityId()))
                : cityService.findOrCreateCity(request.getEndCityName(), request.getEndCityLat(), request.getEndCityLon(), "Indonesia");


        Double distanceKM = GeoUtils.calculateDistance(
                startCity.getLatitude(),
                startCity.getLongitude(),
                endCity.getLatitude(),
                endCity.getLongitude()
        );
        // Bulatkan distanceKM ke 2 desimal
        distanceKM = Math.round(distanceKM * 100.0) / 100.0;

        // Hitung estimasi waktu menggunakan EstimationUtils
        Double estimatedDurationHours = Estimation.calculateRealisticTravelTime(distanceKM);

        // Bulatkan estimatedDurationHours ke 2 desimal
        estimatedDurationHours = Estimation.roundToTwoDecimals(estimatedDurationHours);

        Route newRoute = new Route();
        newRoute.setStartCity(startCity);
        newRoute.setEndCity(endCity);
        newRoute.setDetails(request.getDetails());
        newRoute.setBasePrice(request.getBasePrice());
        newRoute.setDistanceKM(distanceKM);
        newRoute.setCargoType(request.getCargoType());
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
        response.setStartCityLat(route.getStartCity().getLatitude());
        response.setStartCityLon(route.getStartCity().getLongitude());
        response.setEndCityName(route.getEndCity().getName());
        response.setEndCityLat(route.getEndCity().getLatitude());
        response.setEndCityLon(route.getEndCity().getLongitude());
        response.setDetails(route.getDetails());
        response.setBasePrice(route.getBasePrice());
        response.setDistanceKM(route.getDistanceKM());
        response.setCargoType(route.getCargoType());
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

        City startCity = request.getStartCityId() != null 
                ? cityRepository.findById(request.getStartCityId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find start city with id: " + request.getStartCityId()))
                : cityService.findOrCreateCity(request.getStartCityName(), request.getStartCityLat(), request.getStartCityLon(), "Indonesia");

        City endCity = request.getEndCityId() != null
                ? cityRepository.findById(request.getEndCityId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "cant find end city with id: " + request.getEndCityId()))
                : cityService.findOrCreateCity(request.getEndCityName(), request.getEndCityLat(), request.getEndCityLon(), "Indonesia");

        Double distanceKM = GeoUtils.calculateDistance(
                startCity.getLatitude(),
                startCity.getLongitude(),
                endCity.getLatitude(),
                endCity.getLongitude()
        );

        distanceKM = Math.round(distanceKM * 100.0) / 100.0;
        // Hitung estimasi waktu menggunakan EstimationUtils
        Double estimatedDurationHours = Estimation.calculateRealisticTravelTime(distanceKM);

        // Bulatkan estimatedDurationHours ke 2 desimal
        estimatedDurationHours = Estimation.roundToTwoDecimals(estimatedDurationHours);


        route.setStartCity(startCity);
        route.setEndCity(endCity);
        route.setDetails(request.getDetails());
        route.setBasePrice(request.getBasePrice());
        route.setDistanceKM(distanceKM);
        route.setCargoType(request.getCargoType());
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
                .startCityLat(route.getStartCity().getLatitude())
                .startCityLon(route.getStartCity().getLongitude())
                .endCityName(route.getEndCity().getName())
                .endCityLat(route.getEndCity().getLatitude())
                .endCityLon(route.getEndCity().getLongitude())
                .details(route.getDetails())
                .cargoType(route.getCargoType())
                .basePrice(route.getBasePrice())
                .distanceKM(route.getDistanceKM())
                .estimatedDurationHours(route.getEstimatedDurationHours())
                .isActive(route.getIsActive())
                .createdAt(route.getCreatedAt())
                .build()
        ).toList();
    }

}
