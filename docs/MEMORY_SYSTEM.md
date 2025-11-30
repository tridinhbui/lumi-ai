# Memory System Documentation - Phase 1

## Overview

Phase 1 của Memory System đã được implement với 2 tính năng chính:
1. **Persistent Chat Sessions**: Lưu trữ và khôi phục conversation history
2. **Context Window Management**: Quản lý context window với sliding window và summarization

## Architecture

### Components

1. **`services/memoryService.ts`**
   - `buildContextWindow()`: Xây dựng context window tối ưu
   - `summarizeMessages()`: Tóm tắt messages cũ bằng Gemini
   - `getConversationHistory()`: Lấy conversation history với summary
   - `messagesToGeminiFormat()`: Convert messages sang format Gemini

2. **`services/caseCompetitionService.ts`**
   - `getOrCreateSession()`: Tạo/khôi phục session với conversation history
   - `startCaseChat(threadId?)`: Khởi tạo chat với threadId
   - `sendCaseMessage(message, files?, threadId?)`: Gửi message với threadId

3. **`services/supabaseService.ts`**
   - `createOrUpdateSession()`: Tạo/cập nhật session trong database
   - `getSession()`: Lấy session từ database

4. **Database Schema**
   - `chat_sessions` table: Lưu session state và context summary
   - Triggers: Tự động sync message count

## How It Works

### 1. Persistent Sessions

Khi user gửi message:
1. System kiểm tra xem có session cho threadId chưa
2. Nếu chưa có, tạo session mới và restore conversation history
3. Session được lưu trong memory (Map) và có thể persist vào database

```typescript
// Example usage
const response = await sendCaseMessage(
  "What is market sizing?",
  undefined,
  threadId // Pass threadId for persistent session
);
```

### 2. Context Window Management

**Sliding Window Approach:**
- Giữ lại **20 messages gần nhất** (MAX_CONTEXT_MESSAGES)
- Tóm tắt các messages cũ hơn bằng Gemini
- Kết hợp summary + recent messages để tạo context

**Token Management:**
- Ước tính tokens: ~100 tokens/message + content length
- Tự động summarize khi vượt quá giới hạn
- Fallback: simple text summary nếu Gemini API fail

### 3. Conversation History Restoration

Khi tạo session mới:
1. Load tất cả messages từ database
2. Nếu > 20 messages: tách thành old + recent
3. Summarize old messages
4. Restore recent messages vào session
5. Send summary as context message

## Database Migration

Chạy SQL migration trong Supabase:

```bash
# File: supabase-memory-migration.sql
# Run in Supabase SQL Editor
```

Migration sẽ tạo:
- `chat_sessions` table
- Indexes cho performance
- RLS policies
- Triggers để auto-sync message count

## Configuration

Các constants có thể điều chỉnh trong `memoryService.ts`:

```typescript
const MAX_CONTEXT_MESSAGES = 20; // Số messages giữ lại
const MAX_TOKENS_ESTIMATE = 8000; // Token limit
const TOKENS_PER_MESSAGE = 100; // Overhead per message
```

## Usage Examples

### Basic Usage

```typescript
import { sendCaseMessage, startCaseChat } from './services/caseCompetitionService';

// Initialize thread
const welcome = await startCaseChat(threadId);

// Send message with context
const response = await sendCaseMessage(
  "Analyze this case",
  uploadedFiles,
  threadId
);
```

### Advanced: Manual Context Management

```typescript
import { buildContextWindow, getConversationHistory } from './services/memoryService';

// Get optimized context window
const contextWindow = await buildContextWindow(threadId);

// Check if summarization needed
if (needsSummarization(messageCount)) {
  // Auto-summarize will happen
}
```

## Performance Considerations

1. **Session Caching**: Sessions được cache trong memory (Map)
2. **Lazy Loading**: History chỉ được load khi cần
3. **Batch Processing**: Messages được restore theo batch để tránh token limit
4. **Fallback**: Simple summary nếu Gemini API fail

## Limitations & Future Improvements

### Current Limitations:
- Session chỉ tồn tại trong memory (sẽ mất khi restart server)
- Summarization có thể tốn thời gian với conversations dài
- Không có persistent session state trong database (chỉ có metadata)

### Phase 2 Improvements:
- Store session state trong database
- Background summarization job
- Better token counting
- Semantic search for context retrieval

## Testing

Để test memory system:

1. **Test Persistent Sessions:**
   ```typescript
   // Send multiple messages
   await sendCaseMessage("Hello", undefined, threadId);
   await sendCaseMessage("What is case analysis?", undefined, threadId);
   
   // Reload page - context should be preserved
   ```

2. **Test Context Window:**
   ```typescript
   // Send > 20 messages
   // Check that old messages are summarized
   ```

3. **Test Summarization:**
   ```typescript
   // Create long conversation
   // Verify summary is created
   ```

## Troubleshooting

### Session không persist?
- Kiểm tra threadId có được pass vào `sendCaseMessage` không
- Check console logs cho errors

### Context bị mất?
- Verify messages được lưu vào database
- Check `getConversationHistory()` return đúng data

### Summarization không hoạt động?
- Check Gemini API key
- Verify API quota
- Check console logs

## Next Steps (Phase 2)

1. **Memory Summarization**: Thread-level summaries
2. **Metadata & Tagging**: Message metadata và tags
3. **Semantic Search**: Vector search cho context retrieval
4. **Cross-thread Context**: Shared knowledge base

