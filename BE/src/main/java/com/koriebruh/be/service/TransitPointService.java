package com.koriebruh.be.service;


import com.koriebruh.be.dto.TransitPointRequest;
import com.koriebruh.be.dto.TransitPointResponse;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.entity.TransitPoint;
import com.koriebruh.be.repository.CityRepository;
import com.koriebruh.be.repository.TransitPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class TransitPointService {

    @Autowired
    private TransitPointRepository transitPointRepository;


    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private ValidationService validationService;


    public TransitPoint getTransitPointById(Long id) {
        return transitPointRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit Point not found with id: " + id));

    }

    public String createTransitPoint(TransitPointRequest request) {
        validationService.validate(request);

        City loadingCity = cityRepository.findById(request.getLoadingCityId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Loading City not found with id: " + request.getLoadingCityId()));

        City unloadingCity = cityRepository.findById(request.getUnloadingCityId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unloading City not found with id: " + request.getUnloadingCityId()));

        TransitPoint transitPoint = new TransitPoint();
        transitPoint.setLoadingCity(loadingCity);
        transitPoint.setUnloadingCity(unloadingCity);
        transitPoint.setEstimatedDurationMinute(request.getEstimatedDurationMinute());
        transitPoint.setExtraCost(request.getExtraCost());
        transitPoint.setCreatedAt(Instant.now().toEpochMilli());
        transitPoint.setDeletedAt(null); // Assuming null means not deleted
        transitPointRepository.save(transitPoint);

        return "Transit Point created successfully ";
    }

    public String updateTransitPoint(Long id, TransitPointRequest request) {
        validationService.validate(request);

        TransitPoint existingTransitPoint = transitPointRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit Point not found with id: " + id));

        City loadingCity = cityRepository.findById(request.getLoadingCityId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Loading City not found with id: " + request.getLoadingCityId()));

        City unloadingCity = cityRepository.findById(request.getUnloadingCityId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unloading City not found with id: " + request.getUnloadingCityId()));

        // Update fields
        existingTransitPoint.setLoadingCity(loadingCity);
        existingTransitPoint.setUnloadingCity(unloadingCity);
        existingTransitPoint.setEstimatedDurationMinute(request.getEstimatedDurationMinute());
        existingTransitPoint.setExtraCost(request.getExtraCost());
        transitPointRepository.save(existingTransitPoint);

        return "Transit Point updated successfully";
    }

    public String deleteTransitPoint(Long id) {
        TransitPoint existingTransitPoint = transitPointRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit Point not found with id: " + id));

        // Soft delete by setting deletedAt timestamp
        existingTransitPoint.setDeletedAt(Instant.now().toEpochMilli());
        transitPointRepository.save(existingTransitPoint);

        return "Transit Point deleted successfully";
    }

    public List<TransitPointResponse> getAllTransitPoints() {
        List<TransitPoint> transitPoints = transitPointRepository.findAllByDeletedAtNull();
        return transitPoints.stream()
                .map(tp -> new TransitPointResponse(
                        tp.getId(),
                        tp.getLoadingCity().getId(),
                        tp.getUnloadingCity().getId(),
                        tp.getEstimatedDurationMinute(),
                        tp.getExtraCost()
                ))
                .toList();
    }


}
