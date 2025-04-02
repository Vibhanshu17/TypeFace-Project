package com.simplebox.demo.service;

import com.simplebox.demo.model.FileMetadata;
import com.simplebox.demo.model.User;
import com.simplebox.demo.repository.FileRepository;
import com.simplebox.demo.repository.UserRepository;
import com.sun.net.httpserver.HttpsServer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    @Value("${file.storage.location}")
    private String fileLocation;

    @Value("${file.allowed-extensions}")
    private String allowedExtensions;

    @Value("${file.max-size}")
    private String maxFileSize;

    private User getUser(String userName) {
        return userRepository.findByUserName(userName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("User with username %s not found", userName)));
    }

    public FileMetadata uploadFile(String userName, MultipartFile file) {
        User user = getUser(userName);
        try {
            Path uploadPath = Paths.get(fileLocation).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String storageFileName = UUID.randomUUID() + fileExtension;

            Path storageLocation = uploadPath.resolve(storageFileName);
            Files.copy(file.getInputStream(), storageLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadata fileMetadata = new FileMetadata();
            fileMetadata.setOriginalFilename(fileName);
            fileMetadata.setFileLocation(storageFileName);
            fileMetadata.setSize(file.getSize());
            fileMetadata.setMimeType(file.getContentType());
            fileMetadata.setUser(user);

            fileRepository.save(fileMetadata);
            fileMetadata.setUser(null);
            return fileMetadata;
        } catch (IOException e) {
            throw new RuntimeException("Couldn't save file " + file.getOriginalFilename(), e);
        }
    }

    public List<FileMetadata> getAllFiles(String userName) {
        User user = getUser(userName);
        try {
            List<FileMetadata> allFiles = fileRepository.findByUser(user);
            allFiles.forEach(file -> {
                file.setFileLocation("");
                file.setSize(0L);
                file.setUser(null);
            });
            return allFiles;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Transactional
    public void deleteFile(String userName, Long fileId) throws FileNotFoundException {
        User user = getUser(userName);
        FileMetadata fileMetadata = fileRepository.findByUserAndId(user, fileId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("File (id: %d) not found", fileId)));

        try {
            Path filePath = Paths.get(fileLocation).resolve(fileMetadata.getFileLocation()).normalize();
            Files.deleteIfExists(filePath);
            fileRepository.delete(fileMetadata);
        } catch (Exception e) {
            throw new RuntimeException("Could delete file " + fileMetadata.getOriginalFilename() + " try again later\n", e);
        }
    }

    public Resource downloadFile(String userName, Long fileId) throws FileNotFoundException {
        User user = getUser(userName);
        FileMetadata fileMetadata = fileRepository.findByUserAndId(user, fileId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("File (id: %d) not found", fileId)));
        try {
            Path filePath = Paths.get(fileLocation).resolve(fileMetadata.getFileLocation()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists() && resource.isReadable()) {
                return resource;
            }
            else throw new FileNotFoundException("Couldn't read file " + fileMetadata.getOriginalFilename());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
