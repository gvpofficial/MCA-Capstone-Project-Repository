import java.util.ArrayList;
import java.util.List;

public class ChatService {
    private List<Message> messages = new ArrayList<>();

    public void sendMessage(Message msg) {
        messages.add(msg);
    }

    public List<Message> getMessages() {
        return messages;
    }
}
