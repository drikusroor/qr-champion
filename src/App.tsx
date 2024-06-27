import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 512,
  height: 512,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  dotsOptions: {
    color: "white",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#e8e8e8"
  },
});

interface ImageOptions {
  size?: string;
  margin?: string;
}

type DotStyle = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'

function App() {

  const [url, setUrl] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [dotStyle, setDotStyle] = useState<DotStyle>('rounded')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgColorSecondary, setBgColorSecondary] = useState<string | null>(null)
  const [marginSize, setMarginSize] = useState(4)
  const [logo, setLogo] = useState<string | null>(null)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [imageOptions, setImageOptions] = useState<ImageOptions | undefined>({ size: '.5', margin: '0' })
  const [subText, setSubText] = useState('')
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrCodeRef.current) {
      console.error('QR Code ref not found');
      return;
    }
    qrCode.append(qrCodeRef.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url,
      margin: marginSize,
      image,
      imageOptions: {
        margin: Number(imageOptions?.margin) ?? 0,
        imageSize: Number(imageOptions?.size) ?? .5,
      },
      backgroundOptions: {
        color: bgColor,
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: bgColor },
            { offset: 1, color: bgColorSecondary ?? bgColor},
          ],
        },
      },
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
    });
  }, [url, imageOptions, bgColor, bgColorSecondary, marginSize, fgColor, dotStyle, image]);

  useEffect(() => {
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        setImage(logo);
      };
    }
  }, [logo, image, setImage]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files) {
      console.error('No file selected');
      return;
    }

    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {

        if (typeof reader.result !== 'string') {
          console.error('Invalid file type');
          return;
        }

        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = (format: 'png' | 'jpg' | 'svg') => {
    const qrNode = document.getElementById('qr-code');

    if (!qrNode) {
      console.error('QR Code not found');
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
              <span className="mb-1">Dot Style:</span>
              <select
                value={dotStyle}
                onChange={(e) => setDotStyle(e.target.value as DotStyle)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="rounded">Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
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
              <span className="mb-1">Secondary Background Color:</span>
              <input
                type="color"
                value={bgColorSecondary}
                onChange={(e) => setBgColorSecondary(e.target.value)}
                className="h-10 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" onClick={() => setBgColorSecondary(bgColor)}>Reset</button>
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
              <span className="mb-1">Logo Size:</span>
              <input
                type="number"
                placeholder='.5'
                step='.1'
                value={imageOptions?.size}
                onChange={(e) => setImageOptions({ ...imageOptions, size: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Logo Margin Size:</span>
              <input
                type="number"
                value={imageOptions?.margin}
                onChange={(e) => setImageOptions({ ...imageOptions, margin: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">QR Margin Size:</span>
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
            <div ref={qrCodeRef} />
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
