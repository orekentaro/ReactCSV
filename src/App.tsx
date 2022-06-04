import { useState } from 'react'
import logo from './logo.svg'
import Header from './components/Header'
import './App.css'
import CSVDropZone from './components/CSVDrop'
function App() {

  return (
    <div>
      <Header/>
      <CSVDropZone/>
    </div>
    
  )
}

export default App
