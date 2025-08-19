package com.koriebruh.be.utils;

public class Estimation {


    // Constants untuk konfigurasi estimasi
    private static final Double URBAN_SPEED_KMH = 30.0;           // Kecepatan dalam kota
    private static final Double PROVINCIAL_SPEED_KMH = 50.0;      // Kecepatan jalan provinsi
    private static final Double HIGHWAY_SPEED_KMH = 65.0;         // Kecepatan jalan tol/nasional

    private static final Double URBAN_DISTANCE_LIMIT = 50.0;      // Batas jarak urban
    private static final Double PROVINCIAL_DISTANCE_LIMIT = 200.0; // Batas jarak provinsi

    private static final Double REST_INTERVAL_HOURS = 4.0;        // Interval istirahat (jam)
    private static final Double REST_DURATION_HOURS = 0.5;        // Durasi istirahat (30 menit)

    private static final Double BUFFER_PERCENTAGE = 0.15;         // 15% buffer
    private static final Double MINIMUM_HOURS = 1.0;              // Minimum 1 jam
    private static final Double MAXIMUM_HOURS = 72.0;             // Maximum 72 jam (3 hari)

    /**
     * Menghitung estimasi waktu perjalanan yang realistis untuk truck pengiriman
     * dengan mempertimbangkan berbagai faktor nyata
     *
     * @param distanceKM jarak dalam kilometer
     * @return estimasi waktu dalam jam (Double)
     */
    public static Double calculateRealisticTravelTime(Double distanceKM) {
        if (distanceKM == null || distanceKM <= 0) {
            return MINIMUM_HOURS;
        }

        Double totalHours = 0.0;

        // 1. Waktu perjalanan dasar berdasarkan jenis jalan
        Double drivingTime = calculateBaseDrivingTime(distanceKM);
        totalHours += drivingTime;

        // 2. Waktu istirahat wajib driver (setiap 4 jam = 30 menit istirahat)
        Double restTime = Math.floor(drivingTime / REST_INTERVAL_HOURS) * REST_DURATION_HOURS;
        totalHours += restTime;

        // 3. Waktu loading/unloading
        Double loadingTime = calculateLoadingTime(distanceKM);
        totalHours += loadingTime;

        // 4. Waktu delay untuk administrasi/checkpoint
        Double adminTime = calculateAdminTime(distanceKM);
        totalHours += adminTime;

        // 5. Buffer untuk kondisi tak terduga (macet, cuaca, dll)
        Double bufferTime = totalHours * BUFFER_PERCENTAGE;
        totalHours += bufferTime;

        // Apply minimum and maximum limits
        if (totalHours < MINIMUM_HOURS) {
            totalHours = MINIMUM_HOURS;
        }

        if (totalHours > MAXIMUM_HOURS) {
            totalHours = MAXIMUM_HOURS;
        }

        return totalHours;
    }

    /**
     * Menghitung waktu perjalanan dasar berdasarkan karakteristik jalan Indonesia
     *
     * @param distanceKM jarak dalam kilometer
     * @return waktu perjalanan dasar dalam jam
     */
    private static Double calculateBaseDrivingTime(Double distanceKM) {
        Double hours = 0.0;
        Double remainingDistance = distanceKM;

        // Jarak 0-50km: Dalam kota/suburban (kecepatan rata-rata 30 km/h)
        if (remainingDistance > 0) {
            Double urbanDistance = Math.min(remainingDistance, URBAN_DISTANCE_LIMIT);
            hours += urbanDistance / URBAN_SPEED_KMH;
            remainingDistance -= urbanDistance;
        }

        // Jarak 50-200km: Jalan provinsi/antar kota (kecepatan rata-rata 50 km/h)
        if (remainingDistance > 0) {
            Double provincialDistance = Math.min(remainingDistance,
                    PROVINCIAL_DISTANCE_LIMIT - URBAN_DISTANCE_LIMIT);
            hours += provincialDistance / PROVINCIAL_SPEED_KMH;
            remainingDistance -= provincialDistance;
        }

        // Jarak >200km: Jalan tol/nasional (kecepatan rata-rata 65 km/h)
        if (remainingDistance > 0) {
            hours += remainingDistance / HIGHWAY_SPEED_KMH;
        }

        return hours;
    }

    /**
     * Menghitung waktu loading/unloading berdasarkan jarak
     *
     * @param distanceKM jarak dalam kilometer
     * @return waktu loading/unloading dalam jam
     */
    private static Double calculateLoadingTime(Double distanceKM) {
        if (distanceKM <= 50) {
            return 1.0; // 1 jam untuk jarak dekat (loading/unloading sederhana)
        } else if (distanceKM <= 200) {
            return 1.5; // 1.5 jam untuk jarak menengah
        } else {
            return 2.0; // 2 jam untuk jarak jauh (loading/unloading lebih kompleks)
        }
    }

    /**
     * Menghitung waktu untuk administrasi, checkpoint, dll
     *
     * @param distanceKM jarak dalam kilometer
     * @return waktu administrasi dalam jam
     */
    private static Double calculateAdminTime(Double distanceKM) {
        if (distanceKM <= 100) {
            return 0.5; // 30 menit untuk administrasi lokal
        } else if (distanceKM <= 500) {
            return 1.0; // 1 jam untuk lintas kota/provinsi
        } else {
            return 1.5; // 1.5 jam untuk lintas pulau/jarak sangat jauh
        }
    }

    /**
     * Utility method untuk membulatkan hasil estimasi ke 2 desimal
     *
     * @param value nilai yang akan dibulatkan
     * @return nilai yang sudah dibulatkan ke 2 desimal
     */
    public static Double roundToTwoDecimals(Double value) {
        if (value == null) {
            return 0.0;
        }
        return Math.round(value * 100.0) / 100.0;
    }

    /**
     * Method untuk mendapatkan breakdown detail estimasi waktu
     * Berguna untuk debugging atau menampilkan detail ke user
     *
     * @param distanceKM jarak dalam kilometer
     * @return EstimationBreakdown object dengan detail waktu
     */
    public static EstimationBreakdown getDetailedEstimation(Double distanceKM) {
        if (distanceKM == null || distanceKM <= 0) {
            return new EstimationBreakdown(MINIMUM_HOURS, 0.0, 0.0, 0.0, 0.0, 0.0);
        }

        Double drivingTime = calculateBaseDrivingTime(distanceKM);
        Double restTime = Math.floor(drivingTime / REST_INTERVAL_HOURS) * REST_DURATION_HOURS;
        Double loadingTime = calculateLoadingTime(distanceKM);
        Double adminTime = calculateAdminTime(distanceKM);

        Double subtotal = drivingTime + restTime + loadingTime + adminTime;
        Double bufferTime = subtotal * BUFFER_PERCENTAGE;
        Double totalTime = Math.max(subtotal + bufferTime, MINIMUM_HOURS);
        totalTime = Math.min(totalTime, MAXIMUM_HOURS);

        return new EstimationBreakdown(totalTime, drivingTime, restTime,
                loadingTime, adminTime, bufferTime);
    }

    /**
     * Inner class untuk menyimpan breakdown detail estimasi
     */
    public static class EstimationBreakdown {
        private final Double totalHours;
        private final Double drivingHours;
        private final Double restHours;
        private final Double loadingHours;
        private final Double adminHours;
        private final Double bufferHours;

        public EstimationBreakdown(Double totalHours, Double drivingHours, Double restHours,
                                   Double loadingHours, Double adminHours, Double bufferHours) {
            this.totalHours = totalHours;
            this.drivingHours = drivingHours;
            this.restHours = restHours;
            this.loadingHours = loadingHours;
            this.adminHours = adminHours;
            this.bufferHours = bufferHours;
        }

        // Getters
        public Double getTotalHours() {
            return totalHours;
        }

        public Double getDrivingHours() {
            return drivingHours;
        }

        public Double getRestHours() {
            return restHours;
        }

        public Double getLoadingHours() {
            return loadingHours;
        }

        public Double getAdminHours() {
            return adminHours;
        }

        public Double getBufferHours() {
            return bufferHours;
        }

        @Override
        public String toString() {
            return String.format(
                    "EstimationBreakdown{total=%.2f, driving=%.2f, rest=%.2f, loading=%.2f, admin=%.2f, buffer=%.2f}",
                    totalHours, drivingHours, restHours, loadingHours, adminHours, bufferHours
            );
        }
    }

}
