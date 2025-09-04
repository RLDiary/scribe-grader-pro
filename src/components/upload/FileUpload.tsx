import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, Image } from 'lucide-react';
import { useUpload } from '@/hooks/use-upload';

interface FileUploadProps {
  onClose: () => void;
  assignmentId?: string;
  assignmentTitle?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onClose, assignmentId, assignmentTitle: propAssignmentTitle }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const { uploadFile, uploadProgress } = useUpload();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    const titleToUse = propAssignmentTitle || newAssignmentTitle;
    if (selectedFiles.length === 0 || (!propAssignmentTitle && !newAssignmentTitle.trim())) return;

    for (const file of selectedFiles) {
      await uploadFile(file, 'file_upload', titleToUse, assignmentId);
    }
    
    onClose();
  }, [selectedFiles, propAssignmentTitle, newAssignmentTitle, uploadFile, assignmentId, onClose]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload Files</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {propAssignmentTitle ? (
              <div>
                <Label>Assignment</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="font-medium">{propAssignmentTitle}</p>
                  <p className="text-sm text-muted-foreground">Adding submissions to existing assignment</p>
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="assignment-title">Assignment Title</Label>
                <Input
                  id="assignment-title"
                  placeholder="Enter assignment title"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports images (JPG, PNG) and PDF files
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Selected Files</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadProgress.isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress.progress}%</span>
                </div>
                <Progress value={uploadProgress.progress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || (!propAssignmentTitle && !newAssignmentTitle.trim()) || uploadProgress.isUploading}
              className="w-full"
            >
              {uploadProgress.isUploading 
                ? `Uploading... ${uploadProgress.progress}%` 
                : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};