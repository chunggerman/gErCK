backend/
  services/
    workspace_service.py
    content_service.py
    instruction_service.py
    testbench_service.py
    assistant_profile_service.py
    chat_service.py

  core/
    llm_client.py
    vector_store.py
    file_storage.py
    text_storage.py
    logger.py

  orchestration/
    content_orchestrator.py
    chat_orchestrator.py
    assistant_profile_orchestrator.py
Responsibilities:
• workspace_service
	◦ create/get/update/archive workspace
	◦ aggregate workspace state (content + instruction)
• content_service
	◦ handle uploads
	◦ trigger content_orchestrator
	◦ track processing status
• instruction_service
	◦ save/update instruction
	◦ call llm_client for translation/structuring
• testbench_service
	◦ run retrieval + synthesis using workspace content + instruction
	◦ expose debug info (citations, retrieved chunks)
• assistant_profile_service
	◦ create assistant from workspace
	◦ list/update/delete assistants
• chat_service
	◦ manage chat sessions/messages
	◦ call chat_orchestrator for assistant chats
• content_orchestrator
	◦ OCR → chunk → tag → embed → store
• chat_orchestrator
	◦ retrieve → synthesize → log
• assistant_profile_orchestrator
	◦ bind workspace content + instruction into a reusable profile
