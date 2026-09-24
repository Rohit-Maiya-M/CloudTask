package com.rohit.cloudtask.exception;

public class TaskNotFoundException extends RuntimeException{
    public TaskNotFoundException(String msg){
        super(msg);
    }
}
