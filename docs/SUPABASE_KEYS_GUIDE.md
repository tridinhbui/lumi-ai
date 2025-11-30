# Supabase Keys Configuration Guide

## ⚠️ IMPORTANT: Key Types

Supabase có 2 loại keys:

### 1. **Anon/Public Key** (Dùng cho Client-Side)
- Bắt đầu với: `eyJ...` (JWT token)
- **AN TOÀN** để dùng trong client-side code
- Có RLS (Row Level Security) policies để bảo vệ data
- **Dùng key này trong `.env.local`**

### 2. **Service Role Key** (CHỈ dùng cho Server-Side)
- Bắt đầu với: `sb_secret_...` hoặc `eyJ...` (service role)
- **KHÔNG BAO GIỜ** expose trong client-side code
- Bypass tất cả RLS policies
- **KHÔNG dùng key này trong React app**

## 🔧 Cách Lấy Keys Đúng

### Bước 1: Vào Supabase Dashboard
1. Truy cập [supabase.com](https://supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **API**

### Bước 2: Copy Keys
Bạn sẽ thấy:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Dùng key này!)
service_role: sb_secret_... (KHÔNG dùng key này!)
```

### Bước 3: Cấu Hình `.env.local`

Tạo file `.env.local` trong root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
```

**KHÔNG** dùng service_role key!

## 🔍 Kiểm Tra Keys

### Nếu bạn có key bắt đầu với `sb_secret_`:
- ❌ Đây là **service role key**
- ❌ **KHÔNG** dùng trong client-side
- ✅ Chỉ dùng trong server-side (backend API)

### Nếu bạn có key bắt đầu với `eyJ`:
- ✅ Có thể là anon key hoặc service role key
- ✅ Kiểm tra trong Supabase Dashboard để chắc chắn
- ✅ Dùng **anon public** key (không phải service_role)

## 📝 Example `.env.local`

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyDm6dWaoKpFbq5bdn4g8K0AHz7QCdKfn_w

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=336038131508-c46if7971orgluv3m65noiv58e0o14et.apps.googleusercontent.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxx
```

## 🚨 Security Best Practices

1. **KHÔNG commit `.env.local`** vào Git
2. **KHÔNG** expose service role key
3. **LUÔN** dùng anon key cho client-side
4. **KIỂM TRA** RLS policies trong Supabase

## ✅ Verify Configuration

Sau khi config, kiểm tra:

1. **Browser Console** sẽ hiển thị:
   ```
   📊 Database Health Check
   Configured: ✅
   Connected: ✅
   Tables exist: ✅
   ```

2. **Nếu thấy "Using localStorage"**:
   - Kiểm tra `.env.local` có đúng format không
   - Kiểm tra keys có đúng không
   - Restart dev server: `npm run dev`

## 🔗 Resources

- [Supabase Docs: API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Supabase Docs: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

