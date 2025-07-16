package com.koriebruh.be.entity.Enum;

public enum DeliverAlertType {
    // NORMAL
    TRANSIT,
    DELIVERY_COMPLETED,
    CANCELED,

    // ANOMALIES
    ILLEGAL_STOP,                 // Berhenti terlalu lama di luar titik resmi (start, end, transit)
    UNAUTHORIZED_UNLOADING,       // Diduga bongkar muatan ilegal
    IDLE_OUTSIDE_ALLOWED_AREA,    // Diam terlalu lama di titik acak
    ROUTE_DEVIATION,              // Menyimpang dari rute resmi
    GPS_LOST,                      // Hilang sinyal GPS,
}