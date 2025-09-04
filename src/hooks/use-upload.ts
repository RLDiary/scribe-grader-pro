import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  uploadId?: string;
}

export interface UploadResult {
  success: boolean;
  uploadId?: string;
  error?: string;
}

export const useUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
  });
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    method: 'mobile_scan' | 'tablet_capture' | 'file_upload',
    assignmentTitle?: string
  ): Promise<UploadResult> => {
    try {
      setUploadProgress({ isUploading: true, progress: 0 });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      setUploadProgress({ isUploading: true, progress: 25 });

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress({ isUploading: true, progress: 50 });

      // Create assignment if title provided
      let assignmentId = null;
      if (assignmentTitle) {
        const { data: assignment, error: assignmentError } = await supabase
          .from('assignments')
          .insert({
            user_id: user.id,
            title: assignmentTitle,
            description: `Uploaded via ${method.replace('_', ' ')}`
          })
          .select()
          .single();

        if (assignmentError) {
          throw assignmentError;
        }
        assignmentId = assignment.id;
      }

      setUploadProgress({ isUploading: true, progress: 75 });

      // Create upload record
      const { data: upload, error: uploadRecordError } = await supabase
        .from('uploads')
        .insert({
          assignment_id: assignmentId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          upload_method: method,
          status: 'processing'
        })
        .select()
        .single();

      if (uploadRecordError) {
        throw uploadRecordError;
      }

      setUploadProgress({ isUploading: true, progress: 100 });
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and is being processed.`,
      });

      setTimeout(() => {
        setUploadProgress({ isUploading: false, progress: 0 });
      }, 1000);

      return { success: true, uploadId: upload.id };

    } catch (error: any) {
      setUploadProgress({ isUploading: false, progress: 0 });
      
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    }
  };

  return {
    uploadFile,
    uploadProgress,
  };
};