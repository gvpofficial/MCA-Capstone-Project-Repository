package com.mca.chatapp;

import java.time.Instant;

/**
 * Base abstraction for a message in the system.
 */
public abstract class Message {
    private final String sender;
    private final String content;
    private final Instant timestamp;

    protected Message(String sender, String content, Instant timestamp) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getSender() {
        return sender;
    }

    public String getContent() {
        return content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public abstract String getType();
}
