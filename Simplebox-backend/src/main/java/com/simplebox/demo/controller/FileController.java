package com.simplebox.demo.controller;

import com.simplebox.demo.model.FileMetadata;
import com.simplebox.demo.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileController {
    private final FileService fileService;

    @PostMapping("/upload")
    public FileMetadata uploadFile(@RequestParam("userName") String userName, @RequestParam("file") MultipartFile file) {
        return fileService.uploadFile(userName, file);
    }

    @GetMapping("/{userName}")
    public List<FileMetadata> getAllFiles(@PathVariable String userName) {
        return fileService.getAllFiles(userName);
    }

    @GetMapping("/delete/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("fileId") Long fileId, @RequestParam("userName") String userName) {
        try {
            fileService.deleteFile(userName, fileId);
            return ResponseEntity.ok("File deleted");
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/download/{userName}/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String userName, @PathVariable Long fileId) {
        try {
            Resource file = fileService.downloadFile(userName, fileId);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
