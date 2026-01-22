# 🤖 Automation Guide

This project includes a custom CLI tool to manage n8n workflows professionally. Instead of manually exporting/importing JSON files from the n8n UI, you can use the terminal.

## The `workflow_manager.py` Tool

Located in `automation/workflow_manager.py`, this script interfaces directly with the n8n REST API.

### Setup

1.  **Environment Variables**:
    The script currently uses hardcoded credentials for the portfolio demo. In a production environment, these should be moved to a `.env` file.
    *   `N8N_API_KEY`: Your n8n API Key.
    *   `N8N_BASE_URL`: Your n8n instance URL.

2.  **Dependencies**:
    ```bash
    pip install requests
    ```

### Usage Reference

#### `pull`
Downloads the live workflow configuration from the server and saves it to `automation/research_agent_workflow.json`.
*   **Use case**: You made changes in the n8n UI canvas and want to save them to Git.
```bash
python automation/workflow_manager.py pull
```

#### `push`
Uploads the local JSON file to the n8n server.
*   **Use case**: You reverted a change in Git and want to restore the live agent to the previous version.
```bash
python automation/workflow_manager.py push
```

#### `activate`
Ensures the workflow is turned "On" (Active) in n8n.
```bash
python automation/workflow_manager.py activate
```

#### `status`
Displays the health of the agent by listing the 5 most recent executions.
*   **Output**: Shows Execution ID, Success/Fail status, and Mode (manual/webhook).
```bash
python automation/workflow_manager.py status
```

#### `test`
Performs an end-to-end integration test by sending a real payload to the webhook.
*   **Arguments**: `--query "Topic"`
```bash
python automation/workflow_manager.py test --query "The impact of Quantum Computing"
```

## n8n Integration Details

The workflow expects a JSON payload via POST:
```json
{
  "query": "Your research topic here"
}
```

It returns a JSON response (currently configured to return immediately while processing in background, or wait for completion depending on the specific n8n configuration).
