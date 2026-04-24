package com.mca.chatapp;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * Service layer containing business logic.
 */
public class ChatService {
    private final MessageStore messageStore;

    public ChatService(MessageStore messageStore) {
        this.messageStore = messageStore;
    }

    public void addMessage(String sender, String content) {
        String cleanSender = normalize(sender, "Anonymous");
        String cleanContent = normalize(content, "");

        if (cleanContent.isBlank()) {
            throw new IllegalArgumentException("Message content cannot be empty.");
        }

        messageStore.save(new ChatMessage(cleanSender, cleanContent, Instant.now()));
    }

    public List<Message> getAllMessages() {
        return messageStore.findAll();
    }

    private String normalize(String value, String fallback) {
        if (Objects.isNull(value)) {
            return fallback;
        }

        String cleaned = value.trim();
        return cleaned.isBlank() ? fallback : cleaned;
    }
}
