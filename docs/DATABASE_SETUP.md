# Database Setup Guide

## Tổng Quan

BizCase Lab sử dụng Supabase để lưu trữ:
- **Chat Threads**: Các cuộc hội thoại của người dùng
- **Chat Messages**: Tất cả messages trong mỗi thread
- **Chat Sessions**: Session state và context summary
- **Thread Summaries**: Tóm tắt của các threads
- **Message Metadata**: Metadata và tags cho từng message

## Bước 1: Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com)
2. Tạo account mới hoặc đăng nhập
3. Tạo project mới
4. Lưu lại **Project URL** và **anon/public key**

## Bước 2: Chạy SQL Migrations

Mở **SQL Editor** trong Supabase Dashboard và chạy các file sau theo thứ tự:

### 2.1. Schema cơ bản (`supabase-schema.sql`)
Tạo các bảng cơ bản:
- `chat_threads`
- `chat_messages`
- RLS policies

### 2.2. Memory system (`supabase-memory-migration.sql`)
Tạo các bảng cho memory system:
- `chat_sessions`
- `thread_summaries`
- Thêm `metadata` và `tags` columns vào `chat_messages`
- Triggers và functions

## Bước 3: Cấu Hình Environment Variables

Thêm vào file `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bước 4: Kiểm Tra Database Health

Khi app chạy, mở **Browser Console** và kiểm tra:

```
📊 Database Health Check
Configured: ✅
Connected: ✅
Tables exist: ✅
Status: All systems operational ✅
```

Nếu thấy lỗi:
- **Not configured**: Kiểm tra `.env.local`
- **Tables not found**: Chạy lại SQL migrations
- **RLS policy error**: Kiểm tra Row Level Security policies

## Bước 5: Kiểm Tra Data

### Trong Supabase Dashboard:

1. **Table Editor** → `chat_threads`
   - Xem các threads đã được tạo
   - Kiểm tra `user_id`, `name`, `mode`

2. **Table Editor** → `chat_messages`
   - Xem messages trong mỗi thread
   - Kiểm tra `thread_id`, `sender`, `content`

3. **Table Editor** → `chat_sessions`
   - Xem session state
   - Kiểm tra `context_summary`

## Troubleshooting

### Vấn đề: Messages không được lưu

**Nguyên nhân có thể:**
1. Supabase chưa được cấu hình
2. RLS policies chặn insert
3. Schema không đúng

**Giải pháp:**
1. Kiểm tra console logs cho error messages
2. Kiểm tra RLS policies trong Supabase
3. Verify schema matches SQL migrations

### Vấn đề: RLS Policy Error

**Lỗi:** `new row violates row-level security policy`

**Giải pháp:**
1. Kiểm tra policies trong `supabase-schema.sql`
2. Đảm bảo `user_id` được set đúng
3. Test với service role key (chỉ để debug)

### Vấn đề: Tables Not Found

**Lỗi:** `relation "chat_threads" does not exist`

**Giải pháp:**
1. Chạy lại `supabase-schema.sql`
2. Kiểm tra SQL Editor có errors không
3. Verify table names đúng

## Fallback Mode

Nếu Supabase chưa được cấu hình, app sẽ tự động fallback về **localStorage**:
- Data được lưu trong browser localStorage
- Vẫn hoạt động bình thường
- Nhưng data sẽ mất khi clear browser data

**Lưu ý:** Fallback mode chỉ để development. Production cần Supabase.

## Testing Database

### Test Create Thread:
```typescript
const threadId = await createThread('user@example.com', 'Test Thread', 'case-competition');
console.log('Thread created:', threadId);
```

### Test Save Message:
```typescript
const message: Message = {
  id: 'test-1',
  sender: 'user',
  type: 'text',
  content: 'Test message',
  timestamp: Date.now(),
};
const saved = await saveMessage(threadId, message);
console.log('Message saved:', saved);
```

### Test Get Messages:
```typescript
const messages = await getMessages(threadId);
console.log('Messages:', messages);
```

## Production Checklist

- [ ] Supabase project created
- [ ] SQL migrations run successfully
- [ ] Environment variables set
- [ ] RLS policies tested
- [ ] Database health check passes
- [ ] Test create/save/retrieve operations
- [ ] Backup strategy in place

## Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Kiểm tra Supabase Dashboard logs
3. Verify environment variables
4. Test với SQL Editor trực tiếp

