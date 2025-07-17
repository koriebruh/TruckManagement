package com.koriebruh.be.seeder;

import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoutesSeeder implements CommandLineRunner {


    @Autowired
    private RouteService routeService;


    @Override
    public void run(String... args) throws Exception {


        /*DIENG JAKARTA, wait soal nya ada yg belum ada data nya
        * */
//        routeService.createRoute(new RouteRequest(1L, 2L, "Route from Kudus to Semarang", 100.0, true));
//
//
//        routeService.createRoute(new RouteRequest(2L, 3L, "Route from Semarang to Solo", 150.0, true));
//        routeService.createRoute(new RouteRequest(3L, 1L, "Route from Solo to Kudus", 120.0, true));

    }




}
