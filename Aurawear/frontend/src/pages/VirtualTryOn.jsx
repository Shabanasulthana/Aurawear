import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Download, Loader, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function VirtualTryOn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    fetchProduct();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id, stream]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product');
    }
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error('Failed to access camera');
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current && product) {
      const context = canvasRef.current.getContext('2d');
      const canvas = canvasRef.current;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const saturation = getColorSaturation(selectedColor);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const gray = r * 0.299 + g * 0.587 + b * 0.114;

        data[i] = Math.round(r * 0.5 + gray * 0.5);
        data[i + 1] = Math.round(g * 0.5 + gray * 0.5);
        data[i + 2] = Math.round(b * 0.5 + gray * 0.5);
      }

      context.putImageData(imageData, 0, 0);

      drawClothingOverlay(context, canvas, saturation);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `aurawear-tryon-${product.name}.png`;
      link.click();
    }
  };

  const getColorSaturation = (color) => {
    const colorMap = {
      'red': { r: 255, g: 0, b: 0 },
      'blue': { r: 0, g: 0, b: 255 },
      'black': { r: 0, g: 0, b: 0 },
      'white': { r: 255, g: 255, b: 255 },
      'green': { r: 0, g: 128, b: 0 },
      'yellow': { r: 255, g: 255, b: 0 },
      'gold': { r: 212, g: 175, b: 55 }
    };
    return colorMap[color.toLowerCase()] || { r: 100, g: 100, b: 100 };
  };

  const drawClothingOverlay = (context, canvas, color) => {
    context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    context.globalAlpha = 0.3;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    context.fillRect(centerX - 60, centerY - 20, 120, 150);

    context.fillRect(centerX - 100, centerY, 40, 100);
    context.fillRect(centerX + 60, centerY, 40, 100);

    context.globalAlpha = 1;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-primary hover:text-secondary transition"
      >
        <X size={20} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">Virtual Try-On</h1>
          <p className="text-gray-600 mb-6">
            See how {product.name} looks on you using our 2D AR technology
          </p>

          <div className="bg-black rounded-lg overflow-hidden mb-4">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
                <Camera size={64} className="text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 bg-secondary text-primary py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={captureFrame}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center space-x-2"
                >
                  <Download size={20} />
                  <span>Capture & Download</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Stop Camera
                </button>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4 text-primary">{product.name}</h2>

            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-secondary">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.price}
                </span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.material && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Material:</span> {product.material}
                </p>
              </div>
            )}

            {product.careInstructions && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Care:</span> {product.careInstructions}
                </p>
              </div>
            )}

            <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
