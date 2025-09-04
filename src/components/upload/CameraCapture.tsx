import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { useUpload } from '@/hooks/use-upload';
import { useToast } from '@/hooks/use-toast';

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
  const [error, setError] = useState<string | null>(null);
  
  const { uploadFile, uploadProgress } = useUpload();
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    console.log('Starting camera...'); // Debug log
    setError(null); // Clear any previous errors
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      console.log('Requesting camera permissions...'); // Debug log
      
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully'); // Debug log
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before setting isStreaming
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting playback');
          videoRef.current?.play();
          setIsStreaming(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Failed to access camera';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please check your device has a camera.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera access is not supported in this browser.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else {
          errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

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

           {error && (
             <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-destructive" />
               <div className="flex-1">
                 <p className="text-sm text-destructive">{error}</p>
               </div>
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={startCamera}
                 className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
               >
                 Try Again
               </Button>
             </div>
           )}

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