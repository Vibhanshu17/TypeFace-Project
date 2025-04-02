package com.simplebox.demo.repository;

import com.simplebox.demo.model.FileMetadata;
import com.simplebox.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByUser(User user);
    Optional<FileMetadata> findByUserAndId(User user, Long id);
}
