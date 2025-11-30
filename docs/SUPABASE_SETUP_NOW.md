# ⚠️ QUAN TRỌNG: Cấu Hình Supabase Đúng Cách

## 🔴 Key Bạn Đã Cung Cấp

Key `sb_secret_1RxiQNdrbNfoBX-dsycWGg_HezSqHb4` là **Service Role Key**

### ❌ KHÔNG DÙNG KEY NÀY TRONG CLIENT-SIDE!
- Service Role Key bypass tất cả security
- Nếu expose trong React app, ai cũng có thể truy cập database
- **Rất nguy hiểm!**

## ✅ Cần Dùng: Anon/Public Key

### Bước 1: Lấy Keys Đúng

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** (⚙️) → **API**
4. Bạn sẽ thấy:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← DÙNG KEY NÀY!
service_role: sb_secret_...  ← KHÔNG DÙNG!
```

### Bước 2: Copy 2 Thông Tin

1. **Project URL**: `https://xxxxx.supabase.co`
2. **anon public key**: Key bắt đầu với `eyJ...` (JWT token)

### Bước 3: Cập Nhật `.env.local`

Mở file `.env.local` và thay thế:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyDm6dWaoKpFbq5bdn4g8K0AHz7QCdKfn_w

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=336038131508-c46if7971orgluv3m65noiv58e0o14et.apps.googleusercontent.com

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co  ← Thay bằng Project URL của bạn
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← Thay bằng anon public key
```

## 🔍 Làm Sao Biết Key Đúng?

### ✅ Anon Key (ĐÚNG):
- Bắt đầu với `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- Dài (khoảng 200+ ký tự)
- Có label "anon public" trong Supabase Dashboard

### ❌ Service Role Key (SAI):
- Bắt đầu với `sb_secret_` hoặc `eyJ...` (nhưng có label "service_role")
- **KHÔNG** dùng trong client-side

## 📝 Sau Khi Cấu Hình

1. **Restart dev server**:
   ```bash
   # Dừng server (Ctrl+C)
   npm run dev
   ```

2. **Kiểm tra Browser Console**:
   - Mở F12 → Console
   - Bạn sẽ thấy:
     ```
     📊 Database Health Check
     Configured: ✅
     Connected: ✅
     Tables exist: ✅
     ```

3. **Nếu thấy "Using localStorage"**:
   - Kiểm tra lại keys trong `.env.local`
   - Đảm bảo format đúng (không có dấu ngoặc kép)
   - Restart server lại

## 🚨 Security Checklist

- [ ] Đã dùng **anon public key** (không phải service_role)
- [ ] Đã có **Project URL** đúng
- [ ] File `.env.local` không được commit vào Git
- [ ] Đã restart server sau khi thay đổi

## ❓ Vẫn Không Hoạt Động?

1. Kiểm tra console logs
2. Verify keys trong Supabase Dashboard
3. Đảm bảo đã chạy SQL migrations (xem `DATABASE_SETUP.md`)

