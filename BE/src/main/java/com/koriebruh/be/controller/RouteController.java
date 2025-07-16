package com.koriebruh.be.controller;

import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.entity.Route;
import com.koriebruh.be.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RouteController {


    @Autowired
    private RouteService routeService;

    @PostMapping(value = "/routes",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> createRoute(@RequestBody @Valid RouteRequest request) {
        String msg = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/routes/{routeId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<Route>> getRouteById(String routeId) {
        Route routeResponse = routeService.getRouteById(routeId);
        return ResponseEntity.ok(
                WebResponse.<Route>builder()
                        .status("OK")
                        .data(routeResponse)
                        .build()
        );
    }

    @GetMapping(value = "/routes",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<Route>>> getAllRoutes() {
        List<Route> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(
                WebResponse.<List<Route>>builder()
                        .status("OK")
                        .data(routes)
                        .build()
        );
    }

    @PutMapping(value = "/routes/{routeId}",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updateRoute(String routeId, @RequestBody @Valid RouteRequest request) {
        String msg = routeService.updateRoute(routeId, request);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @DeleteMapping(value = "/routes/{routeId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteRoute(@PathVariable String routeId) {
        String msg = routeService.deleteRoute(routeId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

}
