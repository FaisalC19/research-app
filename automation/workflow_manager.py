import requests
import json
import argparse
import sys
import time
import os

class WorkflowManager:
    def __init__(self):
        self.api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTQxMzIxNi1lMmIxLTRjY2QtYmJlMy0wOTQ4NjE4MzU3MzIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY4OTc2MjI2LCJleHAiOjE3NzE1MjA0MDB9.vM0ITNThYGxUZQsM1B1m5zZoGtV-gVe83gPTg-u9D3g"
        self.base_url = "https://n8n.faisal-automation.me/api/v1"
        self.webhook_url = "https://n8n.faisal-automation.me/webhook/research"
        self.headers = {
            "X-N8N-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        self.workflow_file = os.path.join(os.path.dirname(__file__), "research_agent_workflow.json")

    def fetch_workflow(self, search_term="Research Agent"):
        """Fetches the workflow from n8n and saves it locally."""
        print(f"SEARCHING for workflow containing '{search_term}'...")
        try:
            response = requests.get(f"{self.base_url}/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()

            target_workflow = None
            for workflow in data['data']:
                if search_term in workflow['name']:
                    target_workflow = workflow
                    break
                # Optional: Deep search in nodes
                for node in workflow['nodes']:
                    if search_term in node['name']:
                        target_workflow = workflow
                        break
                if target_workflow:
                    break

            if target_workflow:
                print(f"FOUND workflow: {target_workflow['name']} (ID: {target_workflow['id']})")
                
                # Fetch full details (sometimes list query doesn't return everything)
                full_resp = requests.get(f"{self.base_url}/workflows/{target_workflow['id']}", headers=self.headers)
                full_data = full_resp.json()

                with open(self.workflow_file, "w", encoding="utf-8") as f:
                    json.dump(full_data, f, indent=2)
                print(f"SAVED to {self.workflow_file}")
                return full_data['id']
            else:
                print("WORKFLOW not found.")
                return None
        except Exception as e:
            print(f"ERROR fetching workflow: {e}")
            return None

    def push_workflow(self):
        """Pushes the local workflow file to n8n."""
        print(f"PUSHING workflow from {self.workflow_file}...")
        try:
            if not os.path.exists(self.workflow_file):
                print("LOCAL workflow file not found. Run 'pull' first.")
                return

            with open(self.workflow_file, 'r', encoding='utf-8') as f:
                workflow_data = json.load(f)

            workflow_id = workflow_data['id']
            
            # Clean data for API
            payload = self._clean_workflow_data(workflow_data)

            response = requests.put(f"{self.base_url}/workflows/{workflow_id}", headers=self.headers, json=payload)
            
            if response.status_code == 200:
                print("WORKFLOW updated successfully!")
            else:
                print(f"FAILED to update. Status: {response.status_code}")
                print(response.text)

        except Exception as e:
            print(f"ERROR pushing workflow: {e}")

    def activate_workflow(self):
        """Activates the workflow (Active = True)."""
        try:
            if not os.path.exists(self.workflow_file):
                print("LOCAL workflow file not found. Need ID to activate.")
                return

            with open(self.workflow_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                workflow_id = data['id']

            print(f"ACTIVATING workflow {workflow_id}...")
            response = requests.post(f"{self.base_url}/workflows/{workflow_id}/activate", headers=self.headers)

            if response.status_code == 200:
                print("WORKFLOW is now ACTIVE.")
            else:
                print(f"FAILED to activate. Status: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"ERROR activating workflow: {e}")

    def list_executions(self, limit=5):
        """Lists recent executions for the stored workflow."""
        try:
            if not os.path.exists(self.workflow_file):
                print("LOCAL workflow file not found.")
                return

            with open(self.workflow_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                workflow_id = data['id']

            print(f"FETCHING last {limit} executions for {workflow_id}...")
            params = {"workflowId": workflow_id, "limit": limit}
            response = requests.get(f"{self.base_url}/executions", headers=self.headers, params=params)

            if response.status_code == 200:
                executions = response.json().get('data', [])
                if not executions:
                    print("No executions found.")
                for exc in executions:
                    status = "SUCCESS" if exc.get('finished') else "RUNNING/FAILED"
                    print(f"   - ID: {exc['id']} | {status} | Mode: {exc.get('mode')}")
            else:
                print(f"ERROR fetching executions: {response.status_code}")
        except Exception as e:
            print(f"ERROR listing executions: {e}")

    def test_webhook(self, query="Future of Agentic AI"):
        """Sends a test POST request to the webhook."""
        print(f"TESTING Webhook: {self.webhook_url}")
        print(f"QUERY: {query}")
        
        start_time = time.time()
        try:
            response = requests.post(self.webhook_url, json={"query": query}, timeout=300)
            duration = time.time() - start_time
            
            print(f"TIME taken: {duration:.2f}s")
            print(f"STATUS Code: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    print("RESPONSE:")
                    print(json.dumps(response.json(), indent=2))
                except:
                    print("Response Text:", response.text)
            else:
                print("REQUEST failed.")
                print(response.text)
        except Exception as e:
            print(f"TEST failed: {e}")

    def _clean_workflow_data(self, data):
        """Helper to remove read-only fields before pushing."""
        allowed_keys = {'name', 'nodes', 'connections', 'settings', 'staticData', 'pinData'} 
        cleaned = {}
        for key in allowed_keys:
            if key in data:
                if key == 'settings' and isinstance(data[key], dict):
                    cleaned_settings = data[key].copy()
                    # Remove keys that n8n API sometimes rejects on update
                    for k in ['availableInMCP', 'callerPolicy', 'timeSavedMode']:
                        cleaned_settings.pop(k, None)
                    cleaned[key] = cleaned_settings
                else:
                    cleaned[key] = data[key]
        return cleaned

def main():
    parser = argparse.ArgumentParser(description="Manage n8n Research Agent Workflow")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    subparsers.add_parser("pull", help="Download workflow from server")
    subparsers.add_parser("push", help="Upload local workflow to server")
    subparsers.add_parser("activate", help="Activate the workflow")
    subparsers.add_parser("status", help="Check recent executions")
    
    test_parser = subparsers.add_parser("test", help="Test the webhook")
    test_parser.add_argument("--query", type=str, default="Future of AI Agents", help="Search query for test")

    args = parser.parse_args()
    manager = WorkflowManager()

    if args.command == "pull":
        manager.fetch_workflow()
    elif args.command == "push":
        manager.push_workflow()
    elif args.command == "activate":
        manager.activate_workflow()
    elif args.command == "status":
        manager.list_executions()
    elif args.command == "test":
        manager.test_webhook(args.query)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
