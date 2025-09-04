-- Create submissions table for grouping uploads under an assignment
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null,
  student_identifier text,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_assignment_user_unique unique (assignment_id, user_id)
);

-- Enable RLS on submissions
alter table public.submissions enable row level security;

-- Policies for submissions (owner-based)
create policy if not exists "Users can view their own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy if not exists "Users can create their own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own submissions"
  on public.submissions for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own submissions"
  on public.submissions for delete
  using (auth.uid() = user_id);

-- Update trigger for updated_at
create trigger if not exists update_submissions_updated_at
before update on public.submissions
for each row execute function public.update_updated_at_column();

-- Create submission_files table to store individual files per submission
create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  uploaded_at timestamptz not null default now(),
  status text not null default 'processing',
  processing_time text,
  error_message text,
  storage_bucket text not null default 'assignments'
);

-- Index for performance
create index if not exists idx_submission_files_submission_id on public.submission_files(submission_id);

-- Enable RLS on submission_files
alter table public.submission_files enable row level security;

-- Policies for submission_files based on ownership of parent submission
create policy if not exists "Users can view their own submission files"
  on public.submission_files for select
  using (
    exists (
      select 1 from public.submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
    )
  );

create policy if not exists "Users can create their own submission files"
  on public.submission_files for insert
  with check (
    exists (
      select 1 from public.submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
    )
  );

create policy if not exists "Users can update their own submission files"
  on public.submission_files for update
  using (
    exists (
      select 1 from public.submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
    )
  );

create policy if not exists "Users can delete their own submission files"
  on public.submission_files for delete
  using (
    exists (
      select 1 from public.submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
    )
  );

-- Backfill: create one submission per (assignment_id, user_id) and attach existing uploads as files
insert into public.submissions (assignment_id, user_id, status)
select u.assignment_id, u.user_id, coalesce(u.status, 'uploaded')
from public.uploads u
where u.assignment_id is not null
  and u.user_id is not null
group by u.assignment_id, u.user_id, coalesce(u.status, 'uploaded')
on conflict (assignment_id, user_id) do nothing;

insert into public.submission_files (submission_id, file_path, file_name, uploaded_at, status, processing_time, error_message, storage_bucket)
select s.id, u.file_path, u.file_name, u.uploaded_at, u.status, u.processing_time, u.error_message, 'assignments'
from public.uploads u
join public.submissions s
  on s.assignment_id = u.assignment_id
 and s.user_id = u.user_id;

-- Trigger to mirror future inserts into uploads into submission_files via a submissions row
create or replace function public.mirror_upload_to_submission_files()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sub_id uuid;
begin
  -- Skip if upload isn't tied to an assignment
  if NEW.assignment_id is null then
    return NEW;
  end if;

  -- Find or create a submission for this (assignment_id, user_id)
  select id into sub_id
  from public.submissions
  where assignment_id = NEW.assignment_id
    and user_id = NEW.user_id
  limit 1;

  if sub_id is null then
    insert into public.submissions (assignment_id, user_id, status)
    values (NEW.assignment_id, NEW.user_id, coalesce(NEW.status, 'uploaded'))
    returning id into sub_id;
  end if;

  -- Mirror file into submission_files
  insert into public.submission_files (submission_id, file_path, file_name, uploaded_at, status, processing_time, error_message, storage_bucket)
  values (sub_id, NEW.file_path, NEW.file_name, NEW.uploaded_at, NEW.status, NEW.processing_time, NEW.error_message, 'assignments');

  return NEW;
end;
$$;

-- Attach trigger to uploads
create trigger if not exists trg_mirror_upload
after insert on public.uploads
for each row execute function public.mirror_upload_to_submission_files();