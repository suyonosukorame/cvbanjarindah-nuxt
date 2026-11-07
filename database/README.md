# Database Schema - Website Statistics

Schema untuk tracking visits dan visitors di website CV Banjar Indah.

## 📊 Tables

### 1. `page_visits`
Menyimpan setiap page view dengan detail lengkap:
- URL dan title halaman
- Referrer, user agent, IP address
- Device type, browser, OS
- Country dan city
- Session ID untuk grouping

### 2. `unique_visitors`
Menyimpan unique visitors berdasarkan fingerprint/cookie:
- Visitor ID (UUID unik per browser)
- First visit dan last visit timestamp
- Total visits count
- Location info

### 3. `daily_stats`
Pre-aggregated statistics per hari untuk dashboard cepat:
- Total visits dan unique visitors per hari
- Breakdown device type (mobile/desktop/tablet)
- Top page dan top country

## 🚀 Installation

### Step 1: Execute SQL Schema

1. Buka Supabase Dashboard → Project Anda
2. Klik **SQL Editor** di sidebar
3. Klik **New Query**
4. Copy-paste seluruh isi file `schema_stats.sql`
5. Klik **Run** atau tekan `Ctrl+Enter`

### Step 2: Verify Tables Created

Jalankan query ini untuk verify:

```sql
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('page_visits', 'unique_visitors', 'daily_stats');
```

Harus return 3 rows.

### Step 3: Test Insert (Optional)

Test insert dummy data:

```sql
-- Insert test visit
INSERT INTO page_visits (page_url, page_title, device_type, browser, country) 
VALUES ('/', 'Home - CV Banjar Indah', 'desktop', 'Chrome', 'Indonesia');

-- Insert test visitor
SELECT upsert_visitor(gen_random_uuid(), NULL, 'Indonesia', 'Jakarta');

-- Check count
SELECT COUNT(*) FROM page_visits;
SELECT COUNT(*) FROM unique_visitors;
```

## 🔐 Security (RLS Policies)

Schema sudah include Row Level Security policies:

- ✅ **Anonymous users** dapat:
  - INSERT ke `page_visits` (untuk tracking)
  - INSERT/UPDATE ke `unique_visitors` (untuk tracking)
  - SELECT count dari kedua table (untuk display stats)

- ✅ **Authenticated users** dapat:
  - Full access (SELECT, INSERT, UPDATE, DELETE) semua tables
  - Untuk admin dashboard analytics

## 📈 Functions Included

### `upsert_visitor(p_visitor_id, p_ip_address, p_country, p_city)`
Insert visitor baru atau update existing visitor:
- Increment `total_visits`
- Update `last_visit` timestamp

```sql
SELECT upsert_visitor(
  'visitor-uuid-here'::UUID,
  '192.168.1.1'::INET,
  'Indonesia',
  'Jakarta'
);
```

### `get_total_stats()`
Get aggregated stats:
- Total visits (all time)
- Unique visitors (all time)
- Today visits
- Today unique visitors

```sql
SELECT * FROM get_total_stats();
```

## 📊 Views for Analytics

Pre-built views untuk analytics dashboard:

### `view_today_stats`
```sql
SELECT * FROM view_today_stats;
```

### `view_top_pages` (last 30 days)
```sql
SELECT * FROM view_top_pages;
```

### `view_visitor_growth` (last 30 days)
```sql
SELECT * FROM view_visitor_growth;
```

### `view_device_stats`
```sql
SELECT * FROM view_device_stats;
```

### `view_top_countries`
```sql
SELECT * FROM view_top_countries;
```

## 🔄 Auto Tracking

Website sudah setup auto-tracking:

1. **`usePageTracking.ts`** composable:
   - Generate visitor ID (localStorage)
   - Generate session ID (sessionStorage)
   - Detect device, browser, OS
   - Track every page visit

2. **`app.vue`** integration:
   - Auto start tracking on mount
   - Track setiap route change

3. **`Footer.vue`** display:
   - Fetch real-time stats dari Supabase
   - Display di footer copyright component

## 📝 Sample Queries

### Get total visits and visitors
```sql
SELECT 
  (SELECT COUNT(*) FROM page_visits) AS total_visits,
  (SELECT COUNT(*) FROM unique_visitors) AS unique_visitors;
```

### Get visits by device
```sql
SELECT 
  device_type, 
  COUNT(*) AS count,
  ROUND(COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM page_visits) * 100, 2) AS percentage
FROM page_visits
GROUP BY device_type
ORDER BY count DESC;
```

### Get top pages today
```sql
SELECT 
  page_url,
  COUNT(*) AS visits
FROM page_visits
WHERE visited_at >= CURRENT_DATE
GROUP BY page_url
ORDER BY visits DESC
LIMIT 10;
```

### Get visitor growth (last 7 days)
```sql
SELECT 
  DATE(visited_at) AS date,
  COUNT(*) AS visits,
  COUNT(DISTINCT session_id) AS sessions
FROM page_visits
WHERE visited_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(visited_at)
ORDER BY date DESC;
```

## 🛠️ Maintenance

### Clean old data (older than 1 year)
```sql
DELETE FROM page_visits 
WHERE visited_at < NOW() - INTERVAL '1 year';
```

### Rebuild daily stats
```sql
INSERT INTO daily_stats (stat_date, total_visits, unique_visitors)
SELECT 
  DATE(visited_at) AS stat_date,
  COUNT(*) AS total_visits,
  COUNT(DISTINCT session_id) AS unique_visitors
FROM page_visits
WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(visited_at)
ON CONFLICT (stat_date) 
DO UPDATE SET
  total_visits = EXCLUDED.total_visits,
  unique_visitors = EXCLUDED.unique_visitors,
  updated_at = NOW();
```

## 🚨 Troubleshooting

### Stats tidak muncul di website?

1. Check Supabase connection:
```javascript
const { data, error } = await supabase
  .from('page_visits')
  .select('count')
console.log(data, error)
```

2. Check RLS policies enabled:
```sql
SELECT * FROM page_visits LIMIT 1;
```

3. Check browser console untuk errors

### Insert gagal?

Check RLS policies:
```sql
SELECT * FROM pg_policies 
WHERE tablename IN ('page_visits', 'unique_visitors');
```

## 📚 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
