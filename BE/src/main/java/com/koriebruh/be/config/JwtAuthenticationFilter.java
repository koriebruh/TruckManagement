package com.koriebruh.be.config;

import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Skip JWT validation untuk path yang tidak dimulai dengan /api/
        if (requestPath.startsWith("/swagger-ui") ||
                requestPath.startsWith("/v3/api-docs") ||
                requestPath.startsWith("/swagger-resources") ||
                requestPath.startsWith("/webjars") ||
                requestPath.startsWith("/auth")) {

            filterChain.doFilter(request, response); // ⬅️ langsung lanjut tanpa validasi JWT
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Cek apakah header Authorization ada dan dimulai dengan "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
                response.getWriter().flush();
                return;
            }
        }

        // Jika token tidak ada
        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authorization token required\"}");
            response.getWriter().flush();
            return;
        }

        // Validasi token dan set authentication
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid token\"}");
                response.getWriter().flush();
                return;
            }
        }

        // validati token tidak boleh sama dengan token refrsh. yg ada di db
        User user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRefreshToken() != null && user.getRefreshToken().equals(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Refresh token cannot be used as access token\"}");
            response.getWriter().flush();
            return;
        }

        filterChain.doFilter(request, response);
    }

}
