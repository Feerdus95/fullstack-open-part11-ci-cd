package com.noteapp.repository;

import com.noteapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("SELECT n FROM Note n LEFT JOIN FETCH n.categories")
    List<Note> findAllWithCategories();

    @Query("SELECT n FROM Note n JOIN n.categories c WHERE c.id = :categoryId")
    List<Note> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT n FROM Note n JOIN n.categories c WHERE c.id = :categoryId AND n.archived = :archived")
    List<Note> findByCategoryIdAndArchived(@Param("categoryId") Long categoryId, @Param("archived") boolean archived);

    List<Note> findByArchived(boolean archived);
}