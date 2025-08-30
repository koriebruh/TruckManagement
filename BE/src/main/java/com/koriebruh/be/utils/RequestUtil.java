package com.koriebruh.be.utils;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtil {

    /**
     * Mengambil IP client dari HttpServletRequest.
     * Memeriksa header X-Forwarded-For jika ada proxy,
     * jika tidak ada, pakai getRemoteAddr().
     */
    public static String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim(); // ambil IP pertama
    }
}
