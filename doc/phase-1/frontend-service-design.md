flowchart TD

    subgraph Pages
        WSP[Workspace Page]
        APP[Assistant Profiles Page]
        CHP[Chat Page]
    end

    subgraph Workspace Components
        CT[ContentPanel]
        UP[UploadButton]
        CL[ContentList]
        PV[ContentPreview]

        IN[InstructionPanel]
        IE[InstructionEditor]
        TV[TranslationViewer]

        TB[TestBenchPanel]
        CI[ChatInterface]
        RV[RetrievalView]
        CTN[CitationList]
    end

    subgraph Services
        WSSVC[WorkspaceService]
        CTSVC[ContentService]
        INSVC[InstructionService]
        TBSVC[TestBenchService]
        APSVC[AssistantProfileService]
        CHSVC[ChatService]
    end

    WSP --> CT
    WSP --> IN
    WSP --> TB

    CT --> UP
    CT --> CL
    CT --> PV
    UP --> CTSVC
    CL --> CTSVC

    IN --> IE
    IN --> TV
    IE --> INSVC
    TV --> INSVC

    TB --> CI
    TB --> RV
    TB --> CTN
    CI --> TBSVC
    RV --> TBSVC
    CTN --> TBSVC

    APP --> APSVC
    CHP --> CHSVC
