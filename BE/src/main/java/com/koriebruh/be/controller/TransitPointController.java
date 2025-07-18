package com.koriebruh.be.controller;


import com.koriebruh.be.dto.TransitPointRequest;
import com.koriebruh.be.dto.TransitPointResponse;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.entity.TransitPoint;
import com.koriebruh.be.service.TransitPointService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transit-points")
public class TransitPointController {


    @Autowired
    private TransitPointService transitPointService;


    @GetMapping(value = "/{id}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<TransitPoint>> getTransitPointById(@PathVariable Long id) {
        TransitPoint transitPoint = transitPointService.getTransitPointById(id);
        return ResponseEntity.ok(
                WebResponse.<TransitPoint>builder()
                        .status("OK")
                        .data(transitPoint)
                        .build()
        );
    }

    @GetMapping(
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<TransitPointResponse>>> getAllTransitPoints() {
        List<TransitPointResponse> transitPoints = transitPointService.getAllTransitPoints();
        return ResponseEntity.ok(
                WebResponse.<List<TransitPointResponse>>builder()
                        .status("OK")
                        .data(transitPoints)
                        .build()
        );
    }

    @PostMapping(
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> createTransitPoint(@RequestBody @Valid TransitPointRequest request) {
        String msg = transitPointService.createTransitPoint(request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build()
        );
    }

    @PutMapping(value = "/{id}",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updateTransitPoint(@PathVariable Long id, @RequestBody @Valid TransitPointRequest request) {
        String msg = transitPointService.updateTransitPoint(id, request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("UPDATED")
                        .data(msg)
                        .build()
        );
    }

    @DeleteMapping(value = "/{id}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteTransitPoint(@PathVariable Long id) {
        String msg = transitPointService.deleteTransitPoint(id);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("DELETED")
                        .data(msg)
                        .build()
        );

    }
}