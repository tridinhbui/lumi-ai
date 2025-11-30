# 🔧 Fix Supabase URL Error

## ❌ Vấn Đề

URL Supabase trong `.env.local` bị **SAI**:

```
klzmjiixpwwdtjuvcfbc.supabase.coo  ← SAI! (thiếu chữ 'o')
```

Phải là:
```
klzmjiixpwwdtjuvcfbc.supabase.co  ← ĐÚNG!
```

## ✅ Cách Fix

### Bước 1: Mở file `.env.local`

```bash
# Trong terminal
nano .env.local
# hoặc
code .env.local
```

### Bước 2: Sửa URL

Tìm dòng:
```env
VITE_SUPABASE_URL=https://klzmjiixpwwdtjuvcfbc.supabase.coo
```

Sửa thành:
```env
VITE_SUPABASE_URL=https://klzmjiixpwwdtjuvcfbc.supabase.co
```

**Lưu ý:** Thay `.coo` thành `.co` (bỏ một chữ 'o')

### Bước 3: Verify URL

URL Supabase đúng format:
```
https://[project-id].supabase.co
```

**KHÔNG** có:
- `.coo` (sai)
- `.com` (sai)
- Thiếu `https://` (sai)

### Bước 4: Restart Server

```bash
# Dừng server (Ctrl+C)
npm run dev
```

### Bước 5: Kiểm Tra

Mở Browser Console, bạn sẽ thấy:
```
📊 Database Health Check
Configured: ✅
Connected: ✅  ← Phải là ✅
Tables exist: ✅
```

## 🔍 Nếu Vẫn Không Hoạt Động

1. **Kiểm tra Project URL trong Supabase Dashboard:**
   - Vào Supabase Dashboard
   - Settings → API
   - Copy **Project URL** (không phải anon key)
   - Đảm bảo format: `https://xxxxx.supabase.co`

2. **Verify trong `.env.local`:**
   ```env
   VITE_SUPABASE_URL=https://klzmjiixpwwdtjuvcfbc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (anon public key)
   ```

3. **Clear browser cache và reload**

## 📝 Example `.env.local` Đúng

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyDm6dWaoKpFbq5bdn4g8K0AHz7QCdKfn_w

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=336038131508-c46if7971orgluv3m65noiv58e0o14et.apps.googleusercontent.com

# Supabase Configuration
VITE_SUPABASE_URL=https://klzmjiixpwwdtjuvcfbc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

