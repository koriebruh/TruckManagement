package com.koriebruh.be.service;

import com.koriebruh.be.dto.CityRequest;
import com.koriebruh.be.dto.CityResponse;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;


    public CityResponse getCityById(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found"));

        return CityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .latitude(city.getLatitude())
                .longitude(city.getLongitude())
                .country(city.getCountry())
                .build();
    }

    public List<CityResponse> getAllCities() {
        List<City> cities = cityRepository.findAll();
        return cities.stream()
                .map(city -> CityResponse.builder()
                        .id(city.getId())
                        .name(city.getName())
                        .latitude(city.getLatitude())
                        .longitude(city.getLongitude())
                        .country(city.getCountry())
                        .build())
                .toList();
    }

    public String createCity(CityRequest request) {

        if (cityRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "City with this name already exists");
        }

        City city = new City();
        city.setName(request.getName());
        city.setLatitude(request.getLatitude());
        city.setLongitude(request.getLongitude());
        city.setCountry(request.getCountry());
        city.setCreatedAt(Instant.now().getEpochSecond());

        cityRepository.save(city);

        return "City created successfully with ID: " + city.getId();

    }

    public String updateCity(Long id, CityRequest request) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found"));

        if (cityRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "City with this name already exists");
        }

        city.setName(request.getName());
        city.setLatitude(request.getLatitude());
        city.setLongitude(request.getLongitude());
        city.setCountry(request.getCountry());

        cityRepository.save(city);

        return "City updated successfully";
    }

    public String deleteCity(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found"));

        cityRepository.delete(city);
        return "City deleted successfully";
    }

}
