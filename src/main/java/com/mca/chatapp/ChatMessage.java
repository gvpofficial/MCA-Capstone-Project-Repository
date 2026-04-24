package com.mca.chatapp;

import java.time.Instant;

/**
 * Concrete message class used in the chat room.
 */
public class ChatMessage extends Message {
    public ChatMessage(String sender, String content, Instant timestamp) {
        super(sender, content, timestamp);
    }

    @Override
    public String getType() {
        return "CHAT";
    }
}
