package com.mca.chatapp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * In-memory implementation of MessageStore.
 */
public class InMemoryMessageStore implements MessageStore {
    private final List<Message> messages = new ArrayList<>();

    @Override
    public synchronized void save(Message message) {
        messages.add(message);
    }

    @Override
    public synchronized List<Message> findAll() {
        return Collections.unmodifiableList(new ArrayList<>(messages));
    }

    @Override
    public synchronized List<Message> findAfterIndex(int index) {
        if (index < 0 || index >= messages.size()) {
            return findAll();
        }
        return Collections.unmodifiableList(new ArrayList<>(messages.subList(index + 1, messages.size())));
    }
}
