# Phase 0 — Folder Structure
On Your Left — gErCK

This is the actual folder structure for Phase 0.
GERCK/
├── .github/workflows/
│   ├── backend-ci.yaml
│   └── frontend-ci.yaml
├── .venv/
├── backend/
│   ├── capabilities/        ← Layer 2
│   ├── functions/           ← Layer 3
│   ├── llm/                 ← Layer 4
│   ├── orchestration/       ← AI Intelligence Modules
│   ├── storage/             ← Layer 5
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
├── config/                  ← Platform Foundations
│   ├── capabilities/
│   ├── functions/
│   ├── llm/
│   └── doc/
├── frontend/                ← Layer 1
├── .bandit                  ← Security
├── .gitattributes
├── LICENSE
├── README.md
└── requirements.txt
