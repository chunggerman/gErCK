workspace
- id (uuid, pk)
- name (string)
- status (enum: active, archived)
- created_at (datetime)
- updated_at (datetime)

content
- id (uuid, pk)
- workspace_id (uuid, fk → workspace.id)
- filename (string)
- file_path (string)
- text_path (string)
- status (enum: uploaded, processing, processed, failed)
- created_at (datetime)
- updated_at (datetime)

instruction
- id (uuid, pk)
- workspace_id (uuid, fk → workspace.id)
- raw_instruction (text)
- structured_instruction (text)
- created_at (datetime)
- updated_at (datetime)

assistant_profile
- id (uuid, pk)
- workspace_id (uuid, fk → workspace.id)
- name (string)
- description (string, nullable)
- created_at (datetime)
- updated_at (datetime)

chat_session
- id (uuid, pk)
- assistant_profile_id (uuid, fk → assistant_profile.id)
- created_at (datetime)

chat_message
- id (uuid, pk)
- session_id (uuid, fk → chat_session.id)
- role (enum: user, assistant, system)
- content (text)
- created_at (datetime)

content_embedding
- id (uuid, pk)
- content_id (uuid, fk → content.id)
- chunk_id (string)
- embedding_vector (vector)
- metadata (jsonb)
- created_at (datetime)
