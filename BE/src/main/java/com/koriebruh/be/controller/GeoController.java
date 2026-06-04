package com.koriebruh.be.controller;

import com.koriebruh.be.dto.AutocompleteDTO;
import com.koriebruh.be.dto.DirectionsResponse;
import com.koriebruh.be.dto.MatchingResponse;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.utils.GeoAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/geo")
public class GeoController {

    @Autowired
    private GeoAPI geoAPI;

    @GetMapping("/autocomplete")
    public ResponseEntity<WebResponse<List<AutocompleteDTO>>> autocomplete(@RequestParam String q) {
        List<AutocompleteDTO> results = geoAPI.autocomplete(q);
        return ResponseEntity.ok(
                WebResponse.<List<AutocompleteDTO>>builder()
                        .status("OK")
                        .data(results)
                        .build()
        );
    }

    @GetMapping("/directions")
    public ResponseEntity<WebResponse<DirectionsResponse>> getDirections(@RequestParam String points) {
        // points format: lat,lon;lat,lon
        List<double[]> waypoints = parsePoints(points);
        DirectionsResponse response = geoAPI.getDirections(waypoints);
        return ResponseEntity.ok(
                WebResponse.<DirectionsResponse>builder()
                        .status("OK")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/matching")
    public ResponseEntity<WebResponse<MatchingResponse>> mapMatching(@RequestParam String points) {
        // points format: lat,lon;lat,lon
        List<double[]> trace = parsePoints(points);
        MatchingResponse response = geoAPI.mapMatching(trace);
        return ResponseEntity.ok(
                WebResponse.<MatchingResponse>builder()
                        .status("OK")
                        .data(response)
                        .build()
        );
    }

    private List<double[]> parsePoints(String points) {
        List<double[]> result = new ArrayList<>();
        String[] pairs = points.split(";");
        for (String pair : pairs) {
            String[] coords = pair.split(",");
            if (coords.length == 2) {
                result.add(new double[]{
                        Double.parseDouble(coords[0].trim()),
                        Double.parseDouble(coords[1].trim())
                });
            }
        }
        return result;
    }
}
