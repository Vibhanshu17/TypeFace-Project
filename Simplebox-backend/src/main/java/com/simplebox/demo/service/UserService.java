package com.simplebox.demo.service;

import com.simplebox.demo.model.User;
import com.simplebox.demo.repository.UserRepository;
import com.sun.net.httpserver.HttpsServer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FileService fileService;

    public User createUser(User user) {
        if(userRepository.existsByUserName(user.getUserName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("User name: %s already present, choose another one", user.getUserName()));
        }
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("email: %s already present, choose another one", user.getEmail()));
        }
        return userRepository.save(user);
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("User with user_id: %d not found", userId)));
    }

    public User findUserByUserName(String userName) {
        return userRepository.findByUserName(userName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("User with username: %s not found", userName)));

    }

    public List<User> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        allUsers.forEach(user -> user.setFiles(fileService.getAllFiles(user.getUserName())));
        return allUsers;
    }

    public void deleteUser(Long userId) {
        User user = findUserById(userId);
        userRepository.deleteById(userId);
    }
}
