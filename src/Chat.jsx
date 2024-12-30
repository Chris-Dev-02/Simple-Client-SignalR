import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chathub")
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => console.log("Conectado al hub"))
      .catch(err => console.log("Error al conectar: ", err));

    newConnection.on("ReceiveMessage", (user, message) => {
      setMessages(messages => [...messages, { user, message }]);
    });
  }, []);

  const handleSendMessage = () => {
    if (connection) {
      connection.invoke("SendMessage", user, message)
        .catch(err => console.error(err));
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Tu nombre"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Escribe tu mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.user}:</strong> {msg.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
