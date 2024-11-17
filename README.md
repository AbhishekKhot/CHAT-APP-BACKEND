# Chat System Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ contacts : "has"
    users ||--o{ group_chats : "creates"
    users ||--o{ group_chat_members : "joins"
    users ||--o{ chats : "sends"
    users ||--o{ group_chat_messages : "authors"
    users ||--o{ message_tags : "is tagged in"

    group_chats ||--o{ group_chat_members : "contains"
    group_chats ||--o{ group_chat_messages : "has"

    chats ||--o{ attachments : "has"
    group_chat_messages ||--o{ message_tags : "has"

    users {
        int id PK
        string first_name
        string last_name
        string phone_number
        timestamp create_at
        timestamp updated_at
    }

    contacts {
        int id PK
        int contact_user_id FK
        int contacted_user_id FK
        enum relationship_type
        timestamp create_at
        timestamp updated_at
    }

    group_chats {
        int id PK
        string group_name
        int created_by FK
        timestamp create_at
        timestamp updated_at
    }

    group_chat_members {
        int id PK
        int group_chat_id FK
        int member_user_id FK
        timestamp joined_at
    }

    chats {
        int id PK
        int from_user_id FK
        int to_user_id FK
        text message
        enum status
        timestamp create_at
        timestamp updated_at
    }

    group_chat_messages {
        int id PK
        int group_chat_id FK
        int message_author_id FK
        text message
        timestamp create_at
        timestamp updated_at
    }

    attachments {
        int id PK
        int chat_id FK
        string file_path
        timestamp create_at
        timestamp updated_at
    }

    message_tags {
        int id PK
        int message_id FK
        int tagged_user_id FK
    }
```

## Database Schema Description

This database schema represents a chat system with support for:
- Direct messaging between users
- Group chats
- Contact management
- File attachments
- Message tagging
- Message status tracking

## Key Features

- User management with contact relationships
- Support for both direct and group messaging
- File attachment capabilities
- Message status tracking (sent, delivered, read)
- User tagging in messages
- Timestamps for all records