-- Create Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table (User Profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  active_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Organization Members table for Role-Based Access Control (RBAC)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'analyst', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  layout JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies Configuration
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Security: direct client inserts are blocked — the trigger (handle_new_user) handles profile creation with SECURITY DEFINER
CREATE POLICY "Profiles are created by trigger only" ON profiles FOR INSERT WITH CHECK (false);
-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Organizations Policies
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = organizations.id 
      AND organization_members.user_id = auth.uid()
    )
  );

-- Organization Members Policies
CREATE POLICY "Users can view members in their organizations" ON organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.organization_id = organization_members.organization_id 
      AND m.user_id = auth.uid()
    )
  );

-- Security: only org owners can add, update, or remove members
CREATE POLICY "Owners can insert members" ON organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.organization_id = organization_members.organization_id
      AND m.user_id = auth.uid()
      AND m.role = 'owner'
    )
  );

CREATE POLICY "Owners can update member roles" ON organization_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.organization_id = organization_members.organization_id
      AND m.user_id = auth.uid()
      AND m.role = 'owner'
    )
  );

CREATE POLICY "Owners can remove members" ON organization_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.organization_id = organization_members.organization_id
      AND m.user_id = auth.uid()
      AND m.role = 'owner'
    )
  );

-- Datasets Policies (scoped to organization membership)
CREATE POLICY "Users can view organization datasets" ON datasets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = datasets.organization_id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert datasets to their organization" ON datasets
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = organization_id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update organization datasets" ON datasets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = datasets.organization_id 
      AND organization_members.role IN ('owner', 'admin', 'analyst')
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete organization datasets" ON datasets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = datasets.organization_id 
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.user_id = auth.uid()
    )
  );

-- Uploaded Files Policies
CREATE POLICY "Users can view organization files" ON uploaded_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets d
      JOIN organization_members m ON d.organization_id = m.organization_id
      WHERE d.id = uploaded_files.dataset_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files into their organization" ON uploaded_files
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM datasets d
      JOIN organization_members m ON d.organization_id = m.organization_id
      WHERE d.id = dataset_id
      AND m.user_id = auth.uid()
    )
  );

-- Dashboards Policies
CREATE POLICY "Users can view organization dashboards" ON dashboards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = dashboards.organization_id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert organization dashboards" ON dashboards
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = organization_id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update organization dashboards" ON dashboards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = dashboards.organization_id 
      AND organization_members.role IN ('owner', 'admin', 'analyst')
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete organization dashboards" ON dashboards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_members.organization_id = dashboards.organization_id 
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.user_id = auth.uid()
    )
  );

-- Chat Messages Policies
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage Objects Policies
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', false) ON CONFLICT DO NOTHING;
CREATE POLICY "Users can upload files to organization folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'files' AND (
      EXISTS (
        SELECT 1 FROM organization_members 
        WHERE (storage.foldername(name))[1] = organization_members.organization_id::text
        AND organization_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view organization storage files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'files' AND (
      EXISTS (
        SELECT 1 FROM organization_members 
        WHERE (storage.foldername(name))[1] = organization_members.organization_id::text
        AND organization_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete organization storage files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'files' AND (
      EXISTS (
        SELECT 1 FROM organization_members 
        WHERE (storage.foldername(name))[1] = organization_members.organization_id::text
        AND organization_members.role IN ('owner', 'admin')
        AND organization_members.user_id = auth.uid()
      )
    )
  );

-- Create trigger function to handle user signup & auto-provision organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  org_name TEXT;
BEGIN
  -- Determine default organization name
  org_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) || '''s Org';
  
  -- Create default organization
  INSERT INTO public.organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url, active_org_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    new_org_id
  );

  -- Associate user as owner of the organization
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

-- Setup SignUp Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
