package com.koriebruh.be.service;


import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.entity.Route;
import com.koriebruh.be.repository.CityRepository;
import com.koriebruh.be.repository.RouteRepository;
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

        /*NOTE NANTI DISINI ADA LOGIC COUNT DISTANCE DARI START CITY KE END CITY
         *  SETRTA ESTIMATION DURATION BERDASARKAN JARAK, JADI AUTO GENERATE
         * */

        Double distanceKM = 1.0;
        Double estimatedDurationHours = 1.0;


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


    public Route getRouteById(String routeId) {
        return routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));
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

        /*NOTE NANTI DISINI ADA LOGIC COUNT DISTANCE DARI START CITY KE END CITY
         *  SETRTA ESTIMATION DURATION BERDASARKAN JARAK, JADI AUTO GENERATE
         * */

        Double distanceKM = 1.0;
        Double estimatedDurationHours = 1.0;

        Route newRoute = new Route();
        newRoute.setStartCity(startCity);
        newRoute.setEndCity(endCity);
        newRoute.setDetails(request.getDetails());
        newRoute.setBasePrice(request.getBasePrice());
        newRoute.setDistanceKM(distanceKM);
        newRoute.setEstimatedDurationHours(estimatedDurationHours);
        newRoute.setIsActive(request.getIsActive());
        newRoute.setCreatedAt(System.currentTimeMillis());

        routeRepository.save(route);
        return "Route updated successfully";
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

}
