package com.university.booking.controller;

import com.university.booking.dto.AuthRequest;
import com.university.booking.dto.AuthResponse;
import com.university.booking.entity.User;
import com.university.booking.repository.UserRepository;
import com.university.booking.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return ResponseEntity.ok(new AuthResponse(jwt, refreshToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User(signUpRequest.getUsername(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                "ROLE_USER");

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody AuthResponse refreshRequest) {
        String requestRefreshToken = refreshRequest.getRefreshToken();
        
        if (requestRefreshToken != null && tokenProvider.validateToken(requestRefreshToken)) {
            String username = tokenProvider.getUsernameFromJWT(requestRefreshToken);
            String newAccessToken = tokenProvider.generateTokenFromUsername(username);
            
            // In a real app, you might want to rotate refresh tokens too
            return ResponseEntity.ok(new AuthResponse(newAccessToken, requestRefreshToken));
        }
        
        return ResponseEntity.badRequest().body("Invalid Refresh Token");
    }
}
