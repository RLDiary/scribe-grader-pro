import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { useUpload } from '@/hooks/use-upload';

interface CameraCaptureProps {
  mode: 'mobile_scan' | 'tablet_capture';
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ mode, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  
  const { uploadFile, uploadProgress } = useUpload();

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleUpload = useCallback(async () => {
    if (!capturedImage || !assignmentTitle.trim()) return;

    // Convert data URL to File
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `${mode}_${Date.now()}.jpg`, { type: 'image/jpeg' });

    const result = await uploadFile(file, mode, assignmentTitle);
    if (result.success) {
      onClose();
    }
  }, [capturedImage, assignmentTitle, uploadFile, mode, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'mobile_scan' ? 'Mobile Scan' : 'Tablet Capture'}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isStreaming && !capturedImage && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <div>
                <Label htmlFor="assignment-title">Assignment Title</Label>
                <Input
                  id="assignment-title"
                  placeholder="Enter assignment title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={startCamera} className="w-full">
                Start Camera
              </Button>
            </div>
          )}

          {isStreaming && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
              </div>
              <Button onClick={capturePhoto} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg border-2 border-primary/20"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={retakePhoto} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!assignmentTitle.trim() || uploadProgress.isUploading}
                  className="flex-1"
                >
                  {uploadProgress.isUploading ? (
                    `Uploading... ${uploadProgress.progress}%`
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};