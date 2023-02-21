import React, { useEffect } from "react";
import { useState } from 'react';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState(""); 
    const [messageList, setMessageList] = useState([]); 
    
    // The message to send. It is async because we wait for it to get sent before doing anything else
    const sendMessage = async () => {
        if(currentMessage !== "") {
            // We send a object with all relevant data
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    // calls everytime there is a change in the socket server
    // This time the backend calls to the frontend
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            console.log("Received message");
            console.log(data);
        });
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent) => {
                    return (
                    <div className="message" id={username === messageContent.author ? "you" : "other"}>
                        <div className="message-content">
                            <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                            <p id="time">{messageContent.time}</p>
                            <p author="author">{messageContent.author}</p>
                        </div>
                    </div>
                    )
                })}
            </div>
            <div className="chat-footer">
                <input type="text" placeholder="Hey..." onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                /*
                onKeyDown = {(event) => {
                    event.key === "Enter" sendMessage()
                }}
                */
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat;