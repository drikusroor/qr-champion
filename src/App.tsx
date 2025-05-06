import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './App.css';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import QRCodeStyling from 'qr-code-styling';
import { FiRefreshCcw } from 'react-icons/fi';

const qrCode = new QRCodeStyling({
  width: 512,
  height: 512,
  image:
    'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
  dotsOptions: {
    color: 'white',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#e8e8e8',
  },
});

interface ImageOptions {
  size?: string;
  margin?: string;
}

type DotStyle =
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'square'
  | 'extra-rounded';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [fgColor, setFgColor] = useState(searchParams.get('fgColor') || '#000000');
  const [dotStyle, setDotStyle] = useState<DotStyle>(
    (searchParams.get('dotStyle') as DotStyle) || 'rounded'
  );
  const [bgColor, setBgColor] = useState(searchParams.get('bgColor') || '#ffffff');
  const [bgColorSecondary, setBgColorSecondary] = useState<string | null>(
    searchParams.get('bgColorSecondary') || null
  );
  const [marginSize, setMarginSize] = useState(
    Number(searchParams.get('marginSize')) || 16
  );
  const [logo, setLogo] = useState<string | null>(searchParams.get('logo') || null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageOptions, setImageOptions] = useState<ImageOptions | undefined>({
    size: searchParams.get('imageSize') || '.5',
    margin: searchParams.get('imageMargin') || '0',
  });
  const [subText, setSubText] = useState(searchParams.get('subText') || '');
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
        imageSize: Number(imageOptions?.size) ?? 0.5,
      },
      backgroundOptions: {
        color: bgColor,
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: bgColor },
            { offset: 1, color: bgColorSecondary ?? bgColor },
          ],
        },
      },
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
    });
  }, [
    url,
    imageOptions,
    bgColor,
    bgColorSecondary,
    marginSize,
    fgColor,
    dotStyle,
    image,
  ]);

  useEffect(() => {
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        setImage(logo);
      };
    }
  }, [logo, image, setImage]);

  // Update URL query parameters when state changes
  useEffect(() => {
    const params: Record<string, string> = {
      url,
      fgColor,
      dotStyle,
      bgColor,
      marginSize: marginSize.toString(),
      subText,
    };

    if (bgColorSecondary) params.bgColorSecondary = bgColorSecondary;
    if (logo) params.logo = logo;
    if (imageOptions) {
      params.imageSize = imageOptions.size || '';
      params.imageMargin = imageOptions.margin || '';
    }

    setSearchParams(params);
  }, [
    url,
    fgColor,
    dotStyle,
    bgColor,
    bgColorSecondary,
    marginSize,
    logo,
    imageOptions,
    subText,
    setSearchParams,
  ]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

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

  const resetDefaults = () => {
    setUrl('');
    setFgColor('#000000');
    setDotStyle('rounded');
    setBgColor('#ffffff');
    setBgColorSecondary(null);
    setMarginSize(16);
    setLogo(null);
    setImageOptions({ size: '.5', margin: '0' });
    setSubText('');
    setSearchParams({});
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-lg">
          The MCG QR Code Generator
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl flex justify-between gap-8">
          <div className="flex-1">
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
                  value={bgColorSecondary?.toString() ?? bgColor}
                  onChange={(e) => setBgColorSecondary(e.target.value.toString())}
                  className="h-10 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={() => setBgColorSecondary(bgColor)}>
                  Reset
                </button>
              </label>
              <label className="flex flex-col">
                <span className="mb-1">Logo:</span>
                <input
                  type="url"
                  placeholder="https://cataas.com/cat"
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
                  placeholder=".5"
                  step=".1"
                  value={imageOptions?.size}
                  onChange={(e) =>
                    setImageOptions({ ...imageOptions, size: e.target.value })
                  }
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col">
                <span className="mb-1">Logo Margin Size:</span>
                <input
                  type="number"
                  value={imageOptions?.margin}
                  onChange={(e) =>
                    setImageOptions({ ...imageOptions, margin: e.target.value })
                  }
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
            <div className="mt-4">
              <button
                className="px-3 py-2 text-white flex flex-row items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                onClick={resetDefaults}
              >
                <FiRefreshCcw />
                Reset
              </button>
            </div>
          </div>
          <div className="flex-0">
            <div
              className="w-full mt-8 flex flex-col justify-center items-center pb-4"
              id="qr-code"
            >
              <div ref={qrCodeRef} />
              {subText && (
                <p className="text-center font-bold text-xl">{subText}</p>
              )}
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
      </div>
    </>
  );
}

export default App;
