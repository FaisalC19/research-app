# 🌌 Antigravity: AI Research Agent & Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-Next.js_|_n8n_|_Python_|_Tailwind-000000.svg)

**Antigravity** is a production-grade Autonomous Research System. It combines a high-performance **Next.js** frontend with a sophisticated **n8n** agentic backend to perform deep-dive internet research, generate executive reports, and sync data to Notion.

---

## ✨ Key Features

*   **🧠 Autonomous Research**: n8n agents that browse the web, scrape content, and synthesize insights using LLMs (Gemini/DeepSeek).
*   **💻 Neo-Lab Interface**: A futuristic, dark-mode dashboard built with **Tailwind CSS** and **Framer Motion**.
*   **⚡ Real-time Feedback**: Visual progress tracking of the agent's "thought process" via websockets/polling.
*   **📄 Automatic Reporting**: Generates formatted Notion pages and email summaries automatically.
*   **🛠️ CLI Management**: Includes a custom Python CLI for "Infrastructure as Code" management of n8n workflows.

## 🏗️ Architecture

The system follows a decoupled architecture where the Frontend serves as the command center for the Agentic Backend.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React 19 | The user interface for triggering research mission. |
| **Styling** | Tailwind CSS v3 | Custom "Neo-Lab" design system. |
| **Backend API** | Next.js API Routes | Proxies requests to the n8n webhook. |
| **Automation** | n8n | Orchestrates the AI agents, search tools (Tavily), and LLMs. |
| **DevOps** | Python 3 | CLI tool for version controlling and deploying workflows. |

[➡️ View Detailed Architecture](./docs/ARCHITECTURE.md)

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.8+
*   An active n8n instance (Self-hosted or Cloud)

### 1. Installation
Clone the repository and install frontend dependencies:
```bash
git clone https://github.com/FaisalC19/research-app.git
cd research-app
npm install
```

### 2. Run the Dashboard
Start the local development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to see the interface.

### 3. Connect the Automation
Ensure your n8n instance is running. You can manage the connection using our CLI tool.
```bash
# Verify connection to the agent
python automation/workflow_manager.py test --query "Future of AI"
```

[➡️ detailed Automation Guide](./docs/AUTOMATION_GUIDE.md)

## 📂 Project Structure

```bash
research-app/
├── src/                    # Frontend Application
│   ├── app/                # Next.js App Router
│   └── ...
├── automation/             # Backend Automation
│   ├── research_agent_workflow.json  # The Agent's Source Code
│   └── workflow_manager.py           # CLI Management Tool
├── docs/                   # Documentation
└── public/                 # Static Assets
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by Faisal Chandra*
