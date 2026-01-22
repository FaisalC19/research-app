import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query } = body;

        // Webhook URL from the walkthrough/task
        const WEBHOOK_URL = "https://n8n.faisal-automation.me/webhook/research";

        const response = await axios.post(WEBHOOK_URL, { query });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Research API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch research" },
            { status: 500 }
        );
    }
}
