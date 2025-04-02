package com.simplebox.demo.dto;

import com.simplebox.demo.model.User;

import java.time.LocalDateTime;

public record UserDTO(
        Long userId,
        String userName,
        String email,
        LocalDateTime createdAt
) {
    public static UserDTO fromEntity(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
