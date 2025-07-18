package com.koriebruh.be.service;


import com.koriebruh.be.dto.TransitPointRequest;
import com.koriebruh.be.dto.TransitPointResponse;
import com.koriebruh.be.entity.TransitPoint;
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
    private ValidationService validationService;


    public TransitPoint getTransitPointById(Long id) {
        return transitPointRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit Point not found with id: " + id));

    }

    public String createTransitPoint(TransitPointRequest request) {
        validationService.validate(request);

        TransitPoint transitPoint = new TransitPoint();
        transitPoint.setCityName(request.getCityName());
        transitPoint.setEstimatedDurationMinute(request.getEstimatedDurationMinute());
        transitPoint.setExtraCost(request.getExtraCost());
        transitPoint.setLatitude(request.getLatitude());
        transitPoint.setLongitude(request.getLongitude());
        transitPoint.setCreatedAt(Instant.now().toEpochMilli());
        transitPoint.setDeletedAt(null); // Assuming null means not deleted
        transitPointRepository.save(transitPoint);

        return "Transit Point created successfully ";
    }

    public String updateTransitPoint(Long id, TransitPointRequest request) {
        validationService.validate(request);

        TransitPoint existingTransitPoint = transitPointRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Transit Point not found with id: " + id));

        // Update fields
        existingTransitPoint.setCityName(request.getCityName());
        existingTransitPoint.setEstimatedDurationMinute(request.getEstimatedDurationMinute());
        existingTransitPoint.setExtraCost(request.getExtraCost());
        existingTransitPoint.setLatitude(request.getLatitude());
        existingTransitPoint.setLongitude(request.getLongitude());
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
                        tp.getCityName(),
                        tp.getEstimatedDurationMinute(),
                        tp.getExtraCost(),
                        tp.getLatitude(),
                        tp.getLongitude()))
                .toList();
    }


}
