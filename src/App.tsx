import { useEffect, useState } from 'react'
import './App.css'
import { QRCodeSVG } from 'qrcode.react'
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

interface ImageSettings {
  src: string;
  x?: number;
  y?: number;
  height: number;
  width: number;
  excavate: boolean;
}

function App() {

  const [url, setUrl] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [marginSize, setMarginSize] = useState(4)
  const [logo, setLogo] = useState<string | null>(null)
  const [imageSettings, setImageSettings] = useState<ImageSettings | undefined>(undefined)
  const [subText, setSubText] = useState('')

  useEffect(() => {
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        setImageSettings({
          src: logo,
          height: 128,
          width: 128,
          excavate: true,
        });
      };
    }
  }, [logo, setImageSettings]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files) {
      return;
    }

    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = (format: 'png' | 'jpg' | 'svg') => {
    const qrNode = document.getElementById('qr-code');

    if (!qrNode) {
      return;
    }

    const options = {
      backgroundColor: bgColor,
    };

    switch (format) {
      case 'png':
        htmlToImage.toPng(qrNode, options).then((dataUrl) => {
          download(dataUrl, 'qr-code.png');
        });
        break;
      case 'jpg':
        htmlToImage.toJpeg(qrNode, options).then((dataUrl) => {
          download(dataUrl, 'qr-code.jpg');
        });
        break;
      case 'svg':
        htmlToImage.toSvg(qrNode, options).then((dataUrl) => {
          download(dataUrl, 'qr-code.svg');
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">The MCG QR Code Generator</h1>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="mb-1">URL:</span>
              <input
                type="text"
                placeholder="https://example.com"
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
                className="h-10 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Background Color:</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Logo:</span>
              <input
                type="url"
                placeholder='https://cataas.com/cat'
                value={logo || ''}
                onChange={(e) => setLogo(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Upload Logo:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Margin Size:</span>
              <input
                type="number"
                value={marginSize}
                onChange={(e) => setMarginSize(Number(e.target.value))}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Sub Text:</span>
              <input
                type="text"
                placeholder="Scan me!"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </form>
          <div className="w-full mt-8 flex flex-col justify-center items-center pb-4" id="qr-code">
            <QRCodeSVG value={url} fgColor={fgColor} bgColor={bgColor} size={512} imageSettings={imageSettings} imageRendering={'pixelated'} includeMargin={true} level="H" />
            {subText && <p className="text-center font-bold text-xl">{subText}</p>}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2">
            <button
              className="p-2 text-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-700"
              onClick={() => downloadQRCode('png')}
            >
              Download PNG
            </button>
            <button
              className="p-2 text-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-700"
              onClick={() => downloadQRCode('jpg')}
            >
              Download JPG
            </button>
            <button
              className="p-2 text-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-700"
              onClick={() => downloadQRCode('svg')}
            >
              Download SVG
            </button>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
