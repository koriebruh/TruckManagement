package com.koriebruh.be.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.koriebruh.be.dto.LocationIQResponse;
import com.koriebruh.be.entity.Position;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Slf4j
@Service
public class GeoAPI {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${geocoding.locationiq.key}")
    private String apiKey;

    @Value("${geocoding.locationiq.url}")
    private String apiUrl;

    @Value("${geocoding.locationiq.directions.url}")
    private String apiDirectionsUrl;

    @Value("${geocoding.locationiq.matching.url}")
    private String apiMatchingUrl;

    @Value("${geocoding.locationiq.autocomplete.url}")
    private String apiAutocompleteUrl;

    public LocationIQResponse reverseGeocode(double lat, double lon) {
        String url = HttpUrl.parse(apiUrl).newBuilder()
                .addQueryParameter("key", apiKey)
                .addQueryParameter("lat", String.valueOf(lat))
                .addQueryParameter("lon", String.valueOf(lon))
                .addQueryParameter("format", "json")
                .build().toString();

        OkHttpClient client = new OkHttpClient().newBuilder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("LocationIQ Request Failed: {} - {}", response.code(), response.message());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "LocationIQ Request gagal: " + response.code());
            }
            String body = response.body() != null ? response.body().string() : null;
            return objectMapper.readValue(body, LocationIQResponse.class);
        } catch (Exception e) {
            log.error("Error calling LocationIQ API", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error memanggil LocationIQ API", e);
        }
    }

    public List<LocationIQResponse> reverseGeocodeBatch(List<Position> positions) {
        // LocationIQ Free Tier doesn't support batch API (404 error).
        // We will fallback to sequential calls with a rate limit (2 req/sec).
        
        // Limit to latest 10 positions to avoid frontend timeout during geocoding
        List<Position> targetPositions = positions.stream()
                .limit(10)
                .collect(Collectors.toList());
        
        List<LocationIQResponse> results = new ArrayList<>();
        
        for (Position pos : targetPositions) {
            try {
                results.add(reverseGeocode(pos.getLatitude(), pos.getLongitude()));
                // Sleep for 550ms to stay safely under 2 requests per second
                Thread.sleep(550);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Batch processing interrupted", e);
                break;
            } catch (Exception e) {
                log.error("Failed to geocode position at: {}, {}", pos.getLatitude(), pos.getLongitude(), e);
                results.add(new LocationIQResponse()); 
            }
        }
        
        return results;
    }

    public com.koriebruh.be.dto.DirectionsResponse getDirections(List<double[]> waypoints) {
        // format: lon,lat;lon,lat
        String coordinates = waypoints.stream()
                .map(wp -> wp[1] + "," + wp[0]) // LocationIQ uses Lon,Lat
                .collect(Collectors.joining(";"));

        String url = apiDirectionsUrl + coordinates + "?key=" + apiKey + "&overview=full&geometries=polyline";

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder().url(url).get().build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("Directions API failed with code: " + response.code());
            }
            return objectMapper.readValue(response.body().string(), com.koriebruh.be.dto.DirectionsResponse.class);
        } catch (IOException e) {
            log.error("Error calling Directions API", e);
            throw new RuntimeException("Failed to fetch directions", e);
        }
    }

    public com.koriebruh.be.dto.MatchingResponse mapMatching(List<double[]> trace) {
        String coordinates = trace.stream()
                .map(wp -> wp[1] + "," + wp[0])
                .collect(Collectors.joining(";"));

        String url = apiMatchingUrl + coordinates + "?key=" + apiKey + "&overview=full&geometries=polyline";

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder().url(url).get().build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("Matching API failed with code: " + response.code());
            }
            return objectMapper.readValue(response.body().string(), com.koriebruh.be.dto.MatchingResponse.class);
        } catch (IOException e) {
            log.error("Error calling Matching API", e);
            throw new RuntimeException("Failed to match map", e);
        }
    }

    public List<com.koriebruh.be.dto.AutocompleteDTO> autocomplete(String query) {
        String url = HttpUrl.parse(apiAutocompleteUrl).newBuilder()
                .addQueryParameter("key", apiKey)
                .addQueryParameter("q", query)
                .addQueryParameter("limit", "5")
                .build().toString();

        OkHttpClient client = new OkHttpClient.Builder().build();
        Request request = new Request.Builder().url(url).get().build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("Autocomplete API failed with code: " + response.code());
            }
            return Arrays.asList(objectMapper.readValue(response.body().string(), com.koriebruh.be.dto.AutocompleteDTO[].class));
        } catch (IOException e) {
            log.error("Error calling Autocomplete API", e);
            throw new RuntimeException("Failed to search addresses", e);
        }
    }
}
