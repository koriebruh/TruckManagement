package com.koriebruh.be.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.koriebruh.be.dto.GeoResponseAPI;
import com.koriebruh.be.dto.GeoResponseAPIBatch;
import com.koriebruh.be.dto.PositionGeoResponse;
import com.koriebruh.be.dto.PositionRequest;
import com.koriebruh.be.entity.Position;
import lombok.Builder;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Slf4j
@Service
@Builder
public class GeoAPI {

    @Autowired
    private final ObjectMapper objectMapper;

    public GeoResponseAPI reverseGeocode(double lat, double lon) {
        String apiKey = "b4c102bec4454bd8937b222ed9868a7c";
        String url = String.format(
                "https://api.geoapify.com/v1/geocode/reverse?lat=%s&lon=%s&apiKey=%s",
                lat, lon, apiKey
        );
        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();
        Request request = new Request.Builder()
                .url(url)
                .method("GET", null)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Request gagal: " + response.code());
            }
            String body = response.body() != null ? response.body().string() : null;
            return objectMapper.readValue(body, GeoResponseAPI.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error memanggil GeoAPI", e);
        }

    }

    public List<GeoResponseAPIBatch> reverseGeocodeBatch(List<Position> positions) {
        // MAPPER TO LIKE THAT
        // [
        //   [106.84513, -6.21462],
        //   [107.60981, -6.91474],
        //   [110.42030, -6.99320]
        // ]
        double[][] coordinates = positions.stream()
                .map(pos -> new double[]{pos.getLongitude(), pos.getLatitude()})
                .toArray(double[][]::new);

        String apiKey = "b4c102bec4454bd8937b222ed9868a7c";
        String url = String.format(
                "https://api.geoapify.com/v1/batch/geocode/reverse?apiKey=%s", apiKey
        );

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(coordinates);

            RequestBody body = RequestBody.create(
                    jsonBody,
                    MediaType.parse("application/json")
            );

            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .build();

            Request postRequest = new Request.Builder()
                    .url(url)
                    .method("POST", body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            log.info("Sending request to URL: {}", url);
            log.info("Request body: {}", jsonBody);

            // POST untuk dapat URL hasil
            try (Response postResponse = client.newCall(postRequest).execute()) {
                if (!postResponse.isSuccessful()) {
                    throw new RuntimeException("Failed to submit batch job: " + postResponse.code());
                }

                log.info("Response code: {}", postResponse.code());
                log.info("Response body: {}", postResponse);
                String postResponseBody = postResponse.body().string();

                try {
                    Thread.sleep(3000); // 3000 ms = 3 detik
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                // Parse response untuk dapat URL hasil
                // {"id": "bb4c9a7a94964589b32c20bef95edd04", "status": "pending", "url": "https://..."}
                Map<String, Object> jobInfo = objectMapper.readValue(postResponseBody, Map.class);
                String resultUrl = (String) jobInfo.get("url");

                // GET ke URL hasil untuk ambil data sebenarnya
                Request getRequest = new Request.Builder()
                        .url(resultUrl)
                        .method("GET", null)
                        .build();

                log.info("Fetching batch results from: {}", resultUrl);
                try (Response getResponse = client.newCall(getRequest).execute()) {
                    if (!getResponse.isSuccessful()) {
                        throw new RuntimeException("Failed to get batch results: " + getResponse.code());
                    }

                    String responseBody = getResponse.body().string();

                    log.info("Response Body: {}", responseBody);
                    // Parse hasil ke GeoResponseAPIBatch array
                    GeoResponseAPIBatch[] geoResponses = objectMapper.readValue(
                            responseBody,
                            GeoResponseAPIBatch[].class
                    );

//                    log.info();
                    return Arrays.asList(geoResponses);
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to perform reverse geocoding", e);
        }
    }

}
