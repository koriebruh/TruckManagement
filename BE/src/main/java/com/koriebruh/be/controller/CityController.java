package com.koriebruh.be.controller;

import com.koriebruh.be.dto.CityRequest;
import com.koriebruh.be.dto.CityResponse;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.service.CityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {


    @Autowired
    private CityService cityService;


    @GetMapping(value = "/{id}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<CityResponse>> getCityById(@PathVariable Long id) {
        CityResponse cityResponse = cityService.getCityById(id);
        return ResponseEntity.ok(
                WebResponse.<CityResponse>builder()
                        .status("OK")
                        .data(cityResponse)
                        .build()
        );
    }

    @GetMapping(
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<CityResponse>>> getAllCities() {
        List<CityResponse> cities = cityService.getAllCities();
        return ResponseEntity.ok(
                WebResponse.<List<CityResponse>>builder()
                        .status("OK")
                        .data(cities)
                        .build()
        );
    }


    @PostMapping(
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> createCity(@RequestBody @Valid CityRequest request) {
        String msg = cityService.createCity(request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build()
        );
    }

    @DeleteMapping(value = "/{id}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("DELETED")
                        .data("City with ID " + id + " deleted successfully")
                        .build()
        );
    }

    @PutMapping(value = "/{id}",
            produces = "application/json",
            consumes = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updateCity(@PathVariable Long id, @RequestBody @Valid CityRequest request) {
        String msg = cityService.updateCity(id, request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("UPDATED")
                        .data(msg)
                        .build()
        );
    }


}
