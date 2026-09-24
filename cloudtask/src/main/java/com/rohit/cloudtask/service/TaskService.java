package com.rohit.cloudtask.service;

import com.rohit.cloudtask.exception.TaskNotFoundException;
import com.rohit.cloudtask.model.Task;
import com.rohit.cloudtask.repository.TaskRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public Task createTask(Task task) {
        task.setId(null);
        task.setCompleted(false);
        task.setCreatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        Task task = taskRepository.findById(id);

        if (task == null) {
            throw new TaskNotFoundException("Task not found with id: " + id);
        }

        return task;
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existingTask = getTaskById(id);

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setCompleted(updatedTask.isCompleted());

        return taskRepository.save(existingTask);
    }

    public Task completeTask(Long id) {
        Task task = getTaskById(id);

        task.setCompleted(true);

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);

        taskRepository.deleteById(task.getId());
    }

}
