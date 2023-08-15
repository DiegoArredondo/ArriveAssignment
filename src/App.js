import './App.css'
import React, { useEffect, useState } from 'react'

function App () {
  const [connecting, setConnecting] = useState(true)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const socket = new WebSocket('wss://tso-take-home-chat-room.herokuapp.com')

    socket.onopen = () => {
      console.log('WebSocket connected')
      setConnecting(false)
    }

    socket.onmessage = event => {
      const message = event.data.split(':')
      console.log(message)
      setMessages(prevData => {
        const newData = [...prevData]
        // Have the user sent messages before?
        const userIndex = prevData.findIndex(m => m.sender === message[0])
        if (userIndex !== -1) {
          if (newData[userIndex].lastMessage !== message[1]) {
            const words = message[1].split(' ').length
            newData[userIndex].words += words
            newData[userIndex].messagesSent++
            newData[userIndex].lastMessage = message[1]
          }
        } else {
          newData.push({
            sender: message[0],
            messagesSent: 1,
            words: message[1].split(' ').length,
            lastMessage: message[1]
          })
        }
        return newData
      })
    }

    socket.onclose = () => {
      console.log('WebSocket closed')
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div>
      <h2>Sender Word Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Messages Count</th>
            <th>Word Count</th>
            <th>Last Message</th>
          </tr>
        </thead>
        <tbody>
          {connecting ? (
            <tr class='connecting'>
              <td colSpan={4}>Connecting to messages service...</td>
            </tr>
          ) : null}
          {messages.map((messagerData, index) => (
            <tr key={index}>
              <td>{messagerData.sender}</td>
              <td>{messagerData.messagesSent}</td>
              <td>{messagerData.words}</td>
              <td class='message'>{messagerData.lastMessage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
