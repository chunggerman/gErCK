# Phase 1 Folder Structure

## Backend

backend/
│
├── models/
│   ├── workspace.py
│   ├── content.py
│   ├── instruction.py
│   ├── assistant_profile.py
│   ├── chat_session.py
│   └── chat_message.py
│
├── functions/
│   ├── ocr.py
│   ├── chunk.py
│   ├── tag.py
│   ├── embed.py
│   ├── retrieve.py
│   ├── synthesize.py
│   └── translate_instruction.py
│
├── orchestration/
│   ├── content_orchestrator.py
│   ├── chat_orchestrator.py
│   └── assistant_profile_orchestrator.py
│
└── api/
    ├── workspace_api.py
    ├── content_api.py
    ├── instruction_api.py
    ├── testbench_api.py
    └── assistant_profile_api.py
