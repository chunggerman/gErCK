# Phase 1 Architecture Diagram

```mermaid
flowchart TD

    subgraph Workspace UI
        CT[Content Panel]
        IN[Instruction Panel]
        TB[Test Bench]
    end

    subgraph Backend API
        API_WS[Workspace API]
        API_CT[Content API]
        API_IN[Instruction API]
        API_TB[Test Bench API]
        API_AP[Assistant Profile API]
    end

    subgraph Orchestration
        DOC_ORCH[Content Orchestrator]
        CHAT_ORCH[Chat Orchestrator]
        AP_ORCH[Assistant Profile Orchestrator]
    end

    subgraph Functions
        OCR[OCR]
        CHUNK[Chunking]
        TAG[Tagging]
        EMBED[Embedding]
        RETRIEVE[Retrieval]
        SYNTH[Synthesis]
        TRANS[Instruction Translation]
    end

    subgraph Storage
        FILES[Files]
        TEXT[Extracted Text]
        VEC[Vector Store]
        WS[Workspace Store]
        AP[Assistant Profiles]
        CHAT[Chat History]
    end

    CT --> API_CT
    IN --> API_IN
    TB --> API_TB

    API_CT --> DOC_ORCH
    DOC_ORCH --> OCR --> TEXT
    DOC_ORCH --> CHUNK --> TEXT
    DOC_ORCH --> TAG --> TEXT
    DOC_ORCH --> EMBED --> VEC

    API_IN --> TRANS

    API_TB --> CHAT_ORCH
    CHAT_ORCH --> RETRIEVE --> VEC
    CHAT_ORCH --> SYNTH --> CHAT

    API_AP --> AP_ORCH --> AP
