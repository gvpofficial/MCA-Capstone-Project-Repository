package com.mca.chatapp;

import java.util.List;

/**
 * Interface to demonstrate abstraction in OOP.
 */
public interface MessageStore {
    void save(Message message);
    List<Message> findAll();
    List<Message> findAfterIndex(int index);
}
