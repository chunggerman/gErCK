Create workspace → upload content → process
sequenceDiagram
    participant U as User
    participant FE as Workspace UI
    participant API as Workspace API
    participant CTAPI as Content API
    participant ORCH as Content Orchestrator
    participant OCR as OCR
    participant CH as Chunking
    participant EM as Embedding
    participant ST as Storage

    U->>FE: Create workspace
    FE->>API: POST /workspace
    API-->>FE: Workspace created

    U->>FE: Upload content
    FE->>CTAPI: POST /workspace/{id}/content
    CTAPI->>ST: Store raw file
    CTAPI->>ORCH: Trigger processing

    ORCH->>OCR: Extract text
    OCR-->>ORCH: Text
    ORCH->>CH: Chunk + tag
    CH-->>ORCH: Chunks
    ORCH->>EM: Embed
    EM-->>ORCH: Vectors
    ORCH->>ST: Save text + chunks + embeddings

    ORCH-->>CTAPI: Processing complete
    CTAPI-->>FE: Content processed
    FE-->>U: Show processed content

Define instruction → translate → save
sequenceDiagram
    participant U as User
    participant FE as Workspace UI
    participant API as Instruction API
    participant LLM as LLM Engine

    U->>FE: Write instruction
    FE->>API: POST /workspace/{id}/instruction
    API-->>FE: Instruction saved

    U->>FE: Request translation
    FE->>API: POST /instruction/translate
    API->>LLM: Translate instruction
    LLM-->>API: Structured instruction
    API-->>FE: Return structured version
    FE-->>U: Show translated/structured instruction

Test Bench chat inside workspace
sequenceDiagram
    participant U as User
    participant FE as Workspace UI
    participant API as TestBench API
    participant ORCH as Chat Orchestrator
    participant RET as Retrieval
    participant SYN as Synthesis
    participant ST as Vector Store

    U->>FE: Ask question
    FE->>API: POST /workspace/{id}/testbench/chat

    API->>ORCH: Start workspace chat
    ORCH->>RET: Retrieve relevant content
    RET->>ST: Query embeddings
    ST-->>RET: Relevant chunks
    RET-->>ORCH: Retrieved context

    ORCH->>SYN: Generate answer with instruction + context
    SYN-->>ORCH: Final answer

    ORCH-->>API: Response + citations
    API-->>FE: Return answer
    FE-->>U: Display answer + citations

Create Assistant Profile from workspace → chat
sequenceDiagram
    participant U as User
    participant FE as Workspace UI
    participant APAPI as Assistant Profile API
    participant CHFE as Chat UI
    participant CHAPI as Assistant Chat API
    participant ORCH as Chat Orchestrator

    U->>FE: Create Assistant from workspace
    FE->>APAPI: POST /assistant-profile
    APAPI-->>FE: Assistant created

    U->>CHFE: Open Assistant in chat
    CHFE->>CHAPI: POST /assistant-profile/{id}/chat
    CHAPI->>ORCH: Run assistant chat (uses workspace content + instruction)
    ORCH-->>CHAPI: Answer
    CHAPI-->>CHFE: Response
    CHFE-->>U: Display chat
