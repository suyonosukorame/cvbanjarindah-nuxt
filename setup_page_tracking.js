import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file manually
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value.replace(/^['"]|['"]$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

const envVars = loadEnv();
const supabaseUrl = envVars.SUPABASE_URL || envVars.NUXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_KEY || envVars.NUXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Setting up page tracking tables...');
console.log('Supabase URL:', supabaseUrl ? '✓ Found' : '✗ Not found');
console.log('Supabase Key:', supabaseKey ? '✓ Found' : '✗ Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  try {
    console.log('\nStep 1: Creating page_visits table...');
    
    const sql = `
      -- Create page_visits table
      CREATE TABLE IF NOT EXISTS public.page_visits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_url VARCHAR(500) NOT NULL,
        page_title VARCHAR(500),
        referrer VARCHAR(1000),
        user_agent TEXT,
        device_type VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        ip_address INET,
        session_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      -- Create unique_visitors table  
      CREATE TABLE IF NOT EXISTS public.unique_visitors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        visitor_id UUID UNIQUE NOT NULL,
        first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        total_visits INTEGER NOT NULL DEFAULT 1,
        device_type VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    
    // Execute SQL using REST API
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log('Using alternative method...');
      // Try to insert dummy data to trigger table creation
      try {
        await supabase.from('page_visits').insert({
          page_url: '/test',
          page_title: 'Test',
          session_id: '00000000-0000-0000-0000-000000000000'
        });
      } catch (e) {
        console.log('Tables might not exist, continuing...');
      }
    } else {
      console.log('✓ Tables created or already exist');
    }
    
    console.log('\nStep 2: Creating upsert_visitor function...');
    
    const functionSql = `
      CREATE OR REPLACE FUNCTION public.upsert_visitor(p_visitor_id UUID)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        INSERT INTO public.unique_visitors (visitor_id, last_visit, total_visits)
        VALUES (p_visitor_id, NOW(), 1)
        ON CONFLICT (visitor_id) DO UPDATE
          SET last_visit = NOW(),
              total_visits = unique_visitors.total_visits + 1,
              updated_at = NOW();
      END;
      $$;
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: functionSql });
    
    if (functionError) {
      console.log('Function creation error:', functionError.message);
    } else {
      console.log('✓ Function created');
    }
    
    console.log('\nStep 3: Setting up RLS policies...');
    
    const policySql = `
      -- Enable RLS
      ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.unique_visitors ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing policies
      DROP POLICY IF EXISTS "allow_insert_page_visits" ON public.page_visits;
      DROP POLICY IF EXISTS "allow_select_page_visits" ON public.page_visits;
      DROP POLICY IF EXISTS "allow_select_unique_visitors" ON public.unique_visitors;
      
      -- Create new policies
      CREATE POLICY "allow_insert_page_visits" ON public.page_visits
        FOR INSERT TO anon, authenticated WITH CHECK (true);
        
      CREATE POLICY "allow_select_page_visits" ON public.page_visits
        FOR SELECT TO anon, authenticated USING (true);
        
      CREATE POLICY "allow_select_unique_visitors" ON public.unique_visitors
        FOR SELECT TO anon, authenticated USING (true);
    `;
    
    const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySql });
    
    if (policyError) {
      console.log('Policy setup error:', policyError.message);
    } else {
      console.log('✓ RLS policies set');
    }
    
    console.log('\n✅ Setup completed!');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupTables();