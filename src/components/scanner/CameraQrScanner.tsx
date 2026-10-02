'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Upload, Sparkles, CheckCircle2, AlertCircle, SwitchCamera } from 'lucide-react';

interface CameraQrScannerProps {
  onScan: (decodedText: string) => void;
  isScanningActive?: boolean;
}

export const CameraQrScanner: React.FC<CameraQrScannerProps> = ({
  onScan,
  isScanningActive = true,
}) => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerContainerId = 'interactive-qr-reader';
  const lastScannedCodeRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  // Initialize and start scanner
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Stop existing instance if running
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          scannerRef.current.clear();
        } catch (e) {
          console.warn('Error clearing existing scanner:', e);
        }
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: mode },
        config,
        (decodedText: string) => {
          const now = Date.now();
          // Debounce same code within 3 seconds
          if (
            decodedText === lastScannedCodeRef.current &&
            now - lastScannedTimeRef.current < 3000
          ) {
            return;
          }
          lastScannedCodeRef.current = decodedText;
          lastScannedTimeRef.current = now;

          // Provide subtle audio feedback
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
          } catch {}

          onScan(decodedText);
        },
        () => {
          // Frame scan error (no QR detected in frame) — intentionally ignore
        }
      );

      setCameraStarted(true);
    } catch (err: any) {
      console.error('Failed to start camera QR scanner:', err);
      setCameraStarted(false);
      setCameraError(
        err?.message ||
          'Camera access was denied or is not supported in this browser. You can use image upload or token entry below.'
      );
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      setCameraStarted(false);
    }
  };

  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraStarted) {
      await startCamera(nextMode);
    }
  };

  // Handle file upload scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setCameraError(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const tempScanner = new Html5Qrcode('temp-qr-reader-file');
      const decodedText = await tempScanner.scanFile(file, true);
      tempScanner.clear();
      onScan(decodedText);
    } catch (err: any) {
      setCameraError('No valid QR code found in the selected image. Please try another photo.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Auto-start camera when active
  useEffect(() => {
    if (isScanningActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScanningActive]);

  return (
    <div className="w-full bg-[#0c0919] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Hidden container for file-based decoding */}
      <div id="temp-qr-reader-file" className="hidden" />

      {/* Top Controls Bar */}
      <div className="p-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cameraStarted ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="font-semibold text-white">
            {cameraStarted ? 'Live Camera Scanning' : 'Camera Standby'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {cameraStarted ? (
            <>
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
                title="Flip Camera (Rear / Front)"
              >
                <SwitchCamera size={13} />
                <span>{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-semibold flex items-center gap-1 transition-all"
              >
                <CameraOff size={13} /> Stop
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/30"
            >
              <Camera size={13} /> Start Camera
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingFile}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px]"
            title="Scan QR from Image File"
          >
            {isProcessingFile ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative p-4 sm:p-6 flex flex-col items-center justify-center min-h-[280px]">
        {/* Scanner target element */}
        <div
          id={scannerContainerId}
          className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-black/60 relative border border-purple-500/40 shadow-inner"
        />

        {/* Framing guide overlay corners */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[240px] h-[240px] relative pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-70" />
          </div>
        </div>

        {/* Fallback error if camera failed */}
        {cameraError && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2 max-w-md text-left">
            <AlertCircle size={16} className="shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center text-slate-500 text-[11px] font-mono">
        Align the student QR festival pass within the viewfinder square
      </div>
    </div>
  );
};
