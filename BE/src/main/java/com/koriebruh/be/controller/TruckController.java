package com.koriebruh.be.controller;

import com.koriebruh.be.dto.TruckRequest;
import com.koriebruh.be.dto.TruckResponse;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.entity.Truck;
import com.koriebruh.be.service.TruckService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
public class TruckController {

    @Autowired
    private TruckService truckService;


    @GetMapping(value = "/",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<TruckResponse>>> getTrucks() {
        List<TruckResponse> trucks = truckService.getAllTrucks();
        return ResponseEntity.ok(
                WebResponse.<List<TruckResponse>>builder()
                        .status("OK")
                        .data(trucks)
                        .build()
        );
    }

    @GetMapping(value = "/available",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<TruckResponse>>> getTrucksAvailable() {
        List<TruckResponse> trucks = truckService.getAllAvailableTrucks();
        return ResponseEntity.ok(
                WebResponse.<List<TruckResponse>>builder()
                        .status("OK")
                        .data(trucks)
                        .build()
        );
    }


    @GetMapping(value = "/{truckId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<Truck>> getTrucksById(@PathVariable String truckId) {
        Truck trucks = truckService.getTruckById(truckId);
        return ResponseEntity.ok(
                WebResponse.<Truck>builder()
                        .status("OK")
                        .data(trucks)
                        .build()
        );
    }

    @PostMapping(value = "/",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> createTruck(@RequestBody @Valid TruckRequest truck) {
        String msg = truckService.createTruck(truck);
        return ResponseEntity.status(201).body(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build()
        );
    }

    @PutMapping(value = "/{truckId}",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updateTruck(@PathVariable String truckId, @RequestBody @Valid TruckRequest truck) {
        String msg = truckService.updateTruck(truckId, truck);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @DeleteMapping(value = "/{truckId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteTruck(@PathVariable String truckId) {
        String msg = truckService.deleteTruck(truckId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @PutMapping(value = "/maintenance/{truckId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> setMaintenanceTruck(@PathVariable String truckId) {
        String msg = truckService.setMaintenanceTruck(truckId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

}
