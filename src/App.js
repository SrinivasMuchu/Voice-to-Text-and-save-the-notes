import React, { useState, useEffect } from 'react'
import './App.css'
import { detect } from 'lang-detector';
import MicOn from './assets/micon.png'
import MicOff from './assets/micoff.png'
import savenote from './assets/savelogo.png'
import icon from './assets/speech-text.webp'


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
// mic.lang = 'en-US'
mic.lang = 'en'
// mic.lang = 'hi'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <div className='background'>
      <h1 className='heading'>VOICE TO TEXT <img className='pic' src={icon} alt='lll'/></h1>
      <div className="container">
        <div className="box">
          <h2>Voice Notes</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
          <img src={savenote} alt='lll'/>
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
          {isListening ? <img src={MicOff} alt='lll'/> : <img src={MicOn} alt='llll'/>}
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Saved Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App