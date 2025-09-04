import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, X, RotateCcw, Check, AlertCircle, Trash2, Upload } from 'lucide-react';
import { useUpload } from '@/hooks/use-upload';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  mode: 'mobile_scan' | 'tablet_capture';
  onClose: () => void;
  assignmentId?: string;
  assignmentTitle?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ mode, onClose, assignmentId, assignmentTitle }) => {
  console.log('CameraCapture component mounted with mode:', mode); // Debug log
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { uploadFile, uploadProgress } = useUpload();
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    console.log('Starting camera...'); // Debug log
    setError(null); // Clear any previous errors
    setIsStartingCamera(true);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      console.log('Requesting camera permissions...'); // Debug log
      
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera but allow front if needed
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        }
      };

      console.log('Camera constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully', stream); // Debug log
      console.log('Stream tracks:', stream.getTracks());
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log('Setting video source to stream');
        videoRef.current.srcObject = stream;
        
        // Fallback: if metadata doesn't load within 3 seconds, try to start anyway
        const timeoutId = setTimeout(() => {
          if (videoRef.current && videoRef.current.srcObject && !videoRef.current.played.length) {
            console.log('Metadata timeout - forcing stream start');
            videoRef.current.play().then(() => {
              setIsStreaming(true);
              setIsStartingCamera(false);
            }).catch((error) => {
              console.error('Timeout fallback play error:', error);
              setIsStreaming(true);
              setIsStartingCamera(false);
            });
          }
        }, 3000);
        
        // Wait for video to be ready before setting isStreaming
        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          console.log('Video metadata loaded, starting playback');
          videoRef.current?.play().then(() => {
            console.log('Video playback started successfully');
            setIsStreaming(true);
            setIsStartingCamera(false);
          }).catch((error) => {
            console.error('Error starting video playback:', error);
            // Still set streaming to true as the stream is available
            setIsStreaming(true);
            setIsStartingCamera(false);
          });
        };

        // Immediate attempt to play and set streaming - sometimes metadata event doesn't fire
        setTimeout(() => {
          if (videoRef.current && videoRef.current.srcObject) {
            console.log('Attempting immediate video play');
            videoRef.current.play().then(() => {
              console.log('Immediate video play successful');
              setIsStreaming(true);
              setIsStartingCamera(false);
            }).catch((error) => {
              console.log('Immediate play failed, waiting for metadata event:', error);
            });
          }
        }, 500);
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
      setIsStartingCamera(false);
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
        setCapturedImages(prev => [...prev, imageDataUrl]);
        
        toast({
          title: "Photo Captured",
          description: `${capturedImages.length + 1} photo(s) captured`,
        });
      }
    }
  }, [capturedImages.length, toast]);

  const removePhoto = useCallback((index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllPhotos = useCallback(() => {
    setCapturedImages([]);
  }, []);

  const handleUpload = useCallback(async () => {
    if (capturedImages.length === 0) return;
    
    // For assignment creation, need title; for submissions, use existing assignment
    const titleToUse = assignmentTitle || newAssignmentTitle;
    if (!assignmentTitle && !newAssignmentTitle.trim()) return;
    
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < capturedImages.length; i++) {
        const imageDataUrl = capturedImages[i];
        
        // Convert data URL to File
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        
        let fileName: string;
        if (assignmentTitle) {
          // For submissions: assignmentname_submission_1.jpeg
          const sanitizedAssignmentName = assignmentTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
          fileName = `${sanitizedAssignmentName}_submission_${i + 1}.jpeg`;
        } else {
          // For assignment creation: mode_timestamp_index.jpg
          fileName = `${mode}_${Date.now()}_${i + 1}.jpg`;
        }
        
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        const result = await uploadFile(file, mode, titleToUse, assignmentId);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      toast({
        title: "Upload Complete",
        description: `${successCount} photo(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

      if (successCount > 0) {
        onClose();
      }
    } finally {
      setIsUploading(false);
    }
  }, [capturedImages, assignmentTitle, newAssignmentTitle, uploadFile, mode, onClose, toast]);

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
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background relative">
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

          {isStartingCamera && !isStreaming && capturedImages.length === 0 && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Starting Camera...</h3>
                <p className="text-sm text-muted-foreground">Please allow camera access when prompted</p>
              </div>
            </div>
          )}

           {!isStreaming && capturedImages.length === 0 && !isStartingCamera && (
             <div className="text-center space-y-4">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                 <Camera className="h-12 w-12 text-primary" />
               </div>
               <div>
                 {assignmentTitle ? (
                   <>
                     <h3 className="font-semibold text-lg">Ready to capture</h3>
                     <p className="text-sm text-muted-foreground">Assignment: {assignmentTitle}</p>
                   </>
                 ) : (
                   <>
                     <Label htmlFor="assignment-title">Assignment Title</Label>
                     <Input
                       id="assignment-title"
                       placeholder="Enter assignment title"
                       value={newAssignmentTitle}
                       onChange={(e) => setNewAssignmentTitle(e.target.value)}
                       className="mt-1"
                     />
                   </>
                 )}
               </div>
               <Button 
                 onClick={startCamera} 
                 className="w-full" 
                 disabled={error !== null || isStartingCamera}
               >
                 {isStartingCamera ? 'Starting Camera...' : (error ? 'Camera Unavailable' : 'Start Camera')}
               </Button>
             </div>
           )}

           {(isStreaming || isStartingCamera) && (
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
               {isStreaming && (
                 <div className="flex gap-2">
                   <Button onClick={capturePhoto} className="flex-1">
                     <Camera className="mr-2 h-4 w-4" />
                     Capture Photo ({capturedImages.length})
                   </Button>
                   {capturedImages.length > 0 && (
                     <Button variant="outline" onClick={stopCamera}>
                       Done ({capturedImages.length})
                     </Button>
                   )}
                 </div>
               )}
             </div>
           )}

           {capturedImages.length > 0 && !isStreaming && (
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="font-semibold">Captured Photos ({capturedImages.length})</h3>
                 <Button variant="outline" size="sm" onClick={clearAllPhotos}>
                   <Trash2 className="mr-2 h-3 w-3" />
                   Clear All
                 </Button>
               </div>
               
               <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                 {capturedImages.map((image, index) => (
                   <div key={index} className="relative group">
                     <img
                       src={image}
                       alt={`Captured ${index + 1}`}
                       className="w-full aspect-video object-cover rounded-lg border-2 border-primary/20"
                     />
                     <Button
                       variant="destructive"
                       size="sm"
                       className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                       onClick={() => removePhoto(index)}
                     >
                       <X className="h-3 w-3" />
                     </Button>
                   </div>
                 ))}
               </div>

               <div className="flex gap-2">
                 <Button variant="outline" onClick={startCamera} className="flex-1">
                   <Camera className="mr-2 h-4 w-4" />
                   Take More
                 </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={(!assignmentTitle && !newAssignmentTitle.trim()) || isUploading}
                    className="flex-1"
                  >
                   {isUploading ? (
                     <>
                       <Upload className="mr-2 h-4 w-4 animate-spin" />
                       Uploading...
                     </>
                   ) : (
                     <>
                       <Check className="mr-2 h-4 w-4" />
                       Upload All ({capturedImages.length})
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