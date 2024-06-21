import { useState } from 'react'
import './App.css'
import { QRCodeSVG } from 'qrcode.react'

function App() {

  const [url, setUrl] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState('')

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Custom QR Code Generator</h1>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="mb-1">URL:</span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Foreground Color:</span>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-auto"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Background Color:</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-auto"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Logo:</span>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </form>
          <div className="mt-8 flex justify-center">
            <QRCodeSVG value={url} fgColor={fgColor} bgColor={bgColor} logo={logo} />
          </div>
        </div>
      </div>

    </>
  )
}

export default App
