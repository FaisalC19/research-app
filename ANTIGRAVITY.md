# Research Agent & Web Dashboard - Project Antigravity

This repository houses the complete "Antigravity" stack: an Autonomous Agent running on n8n and a premium Next.js frontend dashboard.

## 📂 Project Structure

```
research-app/
├── src/                    # Next.js Web Application (Frontend)
│   ├── app/                # App Router & API Routes
│   ├── components/         # React Components
│   └── ...
├── automation/             # n8n Automation Workflows (Backend Logic)
│   ├── workflow_manager.py # CLI Tool to manage n8n agents
│   └── research_agent.json # The actual source code of the AI Agent
├── public/                 # Static Assets
├── package.json            # Node Dependencies
└── README.md               # App Setup Guide
```

## 🚀 Web Application

The frontend provides a "Neo-Lab" interface for users to interact with the agent.

1.  **Install dependencies**: `npm install`
2.  **Run development server**: `npm run dev`
3.  **Deploy**: Connect this repo to Vercel/Netlify.

## 🤖 Automation Manager (n8n CLI)

We have included a custom Python CLI to manage the n8n workflow "Infrastructure as Code". This allows you to Version Control your AI Agents.

**location**: `./automation/workflow_manager.py`

### Setup
Ensure you have Python installed and the requests library:
```bash
pip install requests
```

### Commands

**1. Pull Workflow (Backup)**
Download the latest version of the agent from the live n8n server to your local file.
```bash
python automation/workflow_manager.py pull
```

**2. Push Workflow (Deploy)**
Upload your local JSON changes to the live n8n server.
```bash
python automation/workflow_manager.py push
```

**3. Activate/Turn On**
Enable the workflow on the server.
```bash
python automation/workflow_manager.py activate
```

**4. Check Status**
View the last 5 execution logs (success/fail).
```bash
python automation/workflow_manager.py status
```

**5. Test Integration**
Send a test webhook request to verify the system is online.
```bash
python automation/workflow_manager.py test --query "Future of Robotics"
```

## 🔄 Data Flow

1.  **User** types a query in the **Next.js Web App**.
2.  Web App sends request to **n8n Webhook**.
3.  **n8n Agent** (Gemini/DeepSeek) performs internet research via Tavily.
4.  Agent compiles a report and saves it to **Notion**.
5.  Agent sends an **Email Notification** to the user.
6.  Agent returns the summary back to the **Web App** for display.
