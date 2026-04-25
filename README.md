# Java OOP Chat Application

This repository contains a complete chat application project built with **Java** (backend server + OOP design) and **HTML/CSS/JavaScript** (frontend UI). The application allows users to send chat messages with a name and content, and it provides live updates every 2 seconds using simple polling.

## Object-Oriented Programming Concepts Used

The following Object-Oriented Programming (OOP) concepts are used in this project:

- **Abstraction**: The `MessageStore` interface defines the behavior required for message storage.
- **Inheritance**: The `ChatMessage` class extends the abstract `Message` class.
- **Encapsulation**: The classes keep their fields private and provide getter and service methods for accessing and manipulating the data.
- **Polymorphism**: The `ChatService` class depends on the `MessageStore` abstraction and can use any implementation.

## Project Structure

The project structure is as follows:

```
src/
  main/
    java/
      com/
        mca/
          chatapp/
            ChatApplication.java
            ChatService.java
            Message.java
            ChatMessage.java
            MessageStore.java
            InMemoryMessageStore.java
    resources/
      public/
        index.html
        styles.css
        app.js
```

## How to Run

To run the chat application, follow these steps:

1. **Compile the Java source code** by running the following command:

   ```bash
   javac -d out src/main/java/com/mca/chatapp/*.java
   ```

2. **Start the server** by running the following command:

   ```bash
   java -cp out com.mca.chatapp.ChatApplication
   ```

3. **Open the chat application** in your browser by visiting: [http://localhost:8080](http://localhost:8080)

## Features

The chat application provides the following features:

- Send chat messages with a name and content.
- Live updates every 2 seconds using simple polling.
- Clean and responsive UI built using HTML/CSS.