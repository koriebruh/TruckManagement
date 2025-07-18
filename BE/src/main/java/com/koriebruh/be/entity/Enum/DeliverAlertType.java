package com.koriebruh.be.entity.Enum;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DeliverAlertType {
    TRANSIT,
    DELIVERY_COMPLETED,
    CANCELED,
    ILLEGAL_STOP,  // Berhenti terlalu lama di luar titik resmi (start, end, transit)
    UNAUTHORIZED_UNLOADING, // Diduga bongkar muatan ilegal
    IDLE_OUTSIDE_ALLOWED_AREA, // Diam terlalu lama di titik acak
    ROUTE_DEVIATION, // Menyimpang dari rute resmi
    GPS_LOST;

    @Override
    @JsonValue // <-- ini buat JSON output (pakai Jackson)
    public String toString() {
        return name().toLowerCase(); // atau pakai kebab_case/snake_case custom di sini
    }
}
