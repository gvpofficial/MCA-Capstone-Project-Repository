# Java OOP Chat Application (HTML/CSS UI)

This repository now contains a complete **chat application project** built with:
- **Java** (backend server + OOP design)
- **HTML/CSS/JavaScript** (frontend UI)

## OOP Concepts Used

- **Abstraction**: `MessageStore` interface defines storage behavior.
- **Inheritance**: `ChatMessage` extends abstract `Message`.
- **Encapsulation**: classes keep fields private with getters/service methods.
- **Polymorphism**: `ChatService` depends on `MessageStore` abstraction and can use any implementation.

## Project Structure

```text
src/main/java/com/mca/chatapp/
  ChatApplication.java
  ChatService.java
  Message.java
  ChatMessage.java
  MessageStore.java
  InMemoryMessageStore.java
public/
  index.html
  styles.css
  app.js
```

## How to Run

### 1) Compile

```bash
mkdir -p out
javac -d out src/main/java/com/mca/chatapp/*.java
```

### 2) Start Server

```bash
java -cp out com.mca.chatapp.ChatApplication
```

### 3) Open in Browser

Visit: [http://localhost:8080](http://localhost:8080)

## Features

- Send chat messages with name + content
- Live updates every 2 seconds (simple polling)
- Clean responsive UI using HTML/CSS
- Java backend API endpoints:
  - `GET /api/messages`
  - `POST /api/messages`
