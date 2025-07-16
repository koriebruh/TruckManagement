package com.koriebruh.be.controller;

import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.dto.WebResponse;
import com.koriebruh.be.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestJwtController {


    @Autowired
    private RouteService routeService;

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        response.put("message", "Hello from protected API!");
        response.put("user", username);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
//
//    @PostMapping(value = "/routes",
//            consumes = "application/json",
//            produces = "application/json"
//    )
//    public ResponseEntity<WebResponse<String>> createRoute(@RequestBody @Valid RouteRequest request) {
//        String msg = routeService.createRoute(request);
//        return ResponseEntity.status(HttpStatus.CREATED).body(
//                WebResponse.<String>builder()
//                        .status("CREATED")
//                        .data(msg)
//                        .build()
//        );
//    }

}
