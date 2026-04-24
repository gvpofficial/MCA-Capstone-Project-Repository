package com.mca.chatapp;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Entry point for the chat application server.
 */
public class ChatApplication {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        ChatService chatService = new ChatService(new InMemoryMessageStore());

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", new StaticHandler());
        server.createContext("/api/messages", new MessagesHandler(chatService));
        server.setExecutor(Executors.newCachedThreadPool());

        System.out.println("Chat app running at http://localhost:" + PORT);
        server.start();
    }

    private static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if ("/".equals(path)) {
                path = "/index.html";
            }

            java.nio.file.Path filePath = java.nio.file.Path.of("public", path.substring(1));
            if (!java.nio.file.Files.exists(filePath)) {
                sendResponse(exchange, 404, "text/plain", "Not found");
                return;
            }

            byte[] bytes = java.nio.file.Files.readAllBytes(filePath);
            sendResponse(exchange, 200, contentType(path), bytes);
        }

        private String contentType(String path) {
            if (path.endsWith(".css")) {
                return "text/css; charset=utf-8";
            }
            if (path.endsWith(".js")) {
                return "application/javascript; charset=utf-8";
            }
            return "text/html; charset=utf-8";
        }
    }

    private static class MessagesHandler implements HttpHandler {
        private static final Pattern SENDER_PATTERN = Pattern.compile("\\\"sender\\\"\\s*:\\s*\\\"(.*?)\\\"");
        private static final Pattern CONTENT_PATTERN = Pattern.compile("\\\"content\\\"\\s*:\\s*\\\"(.*?)\\\"");

        private final ChatService chatService;

        MessagesHandler(ChatService chatService) {
            this.chatService = chatService;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange.getResponseHeaders());

            String method = exchange.getRequestMethod();
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                handleGet(exchange);
            } else if ("POST".equalsIgnoreCase(method)) {
                handlePost(exchange);
            } else {
                sendResponse(exchange, 405, "application/json", "{\"error\":\"Method not allowed\"}");
            }
        }

        private void handleGet(HttpExchange exchange) throws IOException {
            List<Message> messages = chatService.getAllMessages();
            StringBuilder builder = new StringBuilder("[");

            for (int i = 0; i < messages.size(); i++) {
                Message msg = messages.get(i);
                builder.append("{")
                        .append("\"sender\":\"").append(escape(msg.getSender())).append("\",")
                        .append("\"content\":\"").append(escape(msg.getContent())).append("\",")
                        .append("\"timestamp\":\"").append(msg.getTimestamp()).append("\",")
                        .append("\"type\":\"").append(msg.getType()).append("\"")
                        .append("}");
                if (i < messages.size() - 1) {
                    builder.append(',');
                }
            }
            builder.append(']');

            sendResponse(exchange, 200, "application/json", builder.toString());
        }

        private void handlePost(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            String sender = extract(body, SENDER_PATTERN);
            String content = extract(body, CONTENT_PATTERN);

            try {
                chatService.addMessage(unescape(sender), unescape(content));
                sendResponse(exchange, 201, "application/json", "{\"status\":\"ok\"}");
            } catch (IllegalArgumentException ex) {
                sendResponse(exchange, 400, "application/json", "{\"error\":\"" + escape(ex.getMessage()) + "\"}");
            }
        }

        private String extract(String body, Pattern pattern) {
            Matcher matcher = pattern.matcher(body);
            return matcher.find() ? matcher.group(1) : "";
        }

        private String readBody(HttpExchange exchange) throws IOException {
            return new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        }

        private String unescape(String value) {
            return value
                    .replace("\\\\", "\\")
                    .replace("\\\"", "\"")
                    .replace("\\n", "\n");
        }
    }

    private static void addCorsHeaders(Headers headers) {
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendResponse(HttpExchange exchange, int status, String contentType, String body) throws IOException {
        sendResponse(exchange, status, contentType, body.getBytes(StandardCharsets.UTF_8));
    }

    private static void sendResponse(HttpExchange exchange, int status, String contentType, byte[] body) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", contentType);

        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(body);
        }
    }

    private static String escape(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
    }
}
