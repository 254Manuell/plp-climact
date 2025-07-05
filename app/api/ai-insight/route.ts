import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { user, location, stats, historicalData, startDate, endDate } = await req.json()

  // Compose a richer prompt for OpenAI
  const prompt = `You are an air quality and climate action assistant. Based on the following user info, location, stats, and historical air quality data, provide:
- A summary of the air quality for the selected period and location
- A trend analysis (e.g., improving, worsening, stable)
- 2-3 actionable recommendations for the user

User: ${user?.name || "Anonymous"}
Location: ${location || "Unknown"}
Stats: Posts: ${stats?.posts || 0}, Reports: ${stats?.reports || 0}, Discussions: ${stats?.discussions || 0}
Date Range: ${startDate || "-"} to ${endDate || "-"}
Historical Data: ${JSON.stringify(historicalData?.slice(-10) || [])}

Respond in JSON with fields: summary, trend, recommendations (array).`

  // --- Real OpenAI call ---
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not set on server.' }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an air quality and climate action assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 512
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    // Try to parse the AI's response as JSON
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (e) {
      // If parsing fails, return the raw content
      return NextResponse.json({ summary: content, trend: "", recommendations: [] });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch AI insight', details: error?.toString() }, { status: 500 });
  }
}