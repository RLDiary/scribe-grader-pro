-- Create storage bucket for assignment uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create uploads table
CREATE TABLE public.uploads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id),
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_method TEXT NOT NULL CHECK (upload_method IN ('mobile_scan', 'tablet_capture', 'file_upload')),
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'processed', 'failed')),
    student_count INTEGER DEFAULT 0,
    processing_time TEXT,
    error_message TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assignments
CREATE POLICY "Users can view their own assignments" 
ON public.assignments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignments" 
ON public.assignments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments" 
ON public.assignments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments" 
ON public.assignments FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for uploads
CREATE POLICY "Users can view their own uploads" 
ON public.uploads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" 
ON public.uploads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
ON public.uploads FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage policies for assignments bucket
CREATE POLICY "Users can view their own assignment files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own assignment files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own assignment files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assignment files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX idx_uploads_assignment_id ON public.uploads(assignment_id);
CREATE INDEX idx_uploads_status ON public.uploads(status);
CREATE INDEX idx_assignments_user_id ON public.assignments(user_id);