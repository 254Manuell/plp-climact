import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { user, location, stats, historicalData, startDate, endDate, message } = await req.json();

  // Determine if the question is general (no location, stats, or data)
  const isGeneral = (!location && (!stats || Object.keys(stats).length === 0) && (!historicalData || historicalData.length === 0));

  let prompt = "";
  // Always include ClimAct context in the system prompt
  const climactContext = `ClimAct is a platform to help users understand and take action on air quality and climate change. It provides insights, recommendations, and community features to empower individuals and organizations.`;

  if (isGeneral) {
    prompt = `${climactContext}\n\nYou are ClimAct AI, a friendly, knowledgeable, and engaging assistant for the ClimAct platform.\n\nAlways answer the user's question as directly, conversationally, and informatively as possible.\n\n- If the question is about ClimAct, provide a dynamic, context-aware description of the platform, its features, and benefits, and be open to follow-up questions.\n- If the question is about air quality or climate action, provide clear, factual, and actionable advice, and vary your recommendations.\n- If the question is about the dashboard or community, explain features and how users can benefit.\n- For all questions, avoid repeating the same answer, and always be specific to the user's query.\n- Encourage the user to ask follow-up questions.\n- End with a motivational or supportive message.\n\nUser question: ${message}\n\nRespond in JSON format with these fields: summary (string), recommendations (array), motivation (string).`;
  } else {
    prompt = `You are an air quality and climate action assistant. Based on the following user info, location, stats, and historical air quality data, provide:\n- A summary of the air quality for the selected period and location\n- A trend analysis (e.g., improving, worsening, stable)\n- 2-3 actionable recommendations for the user\n\nUser: ${user?.name || "Anonymous"}\nLocation: ${location || "Unknown"}\nStats: Posts: ${stats?.posts || 0}, Reports: ${stats?.reports || 0}, Discussions: ${stats?.discussions || 0}\nDate Range: ${startDate || "-"} to ${endDate || "-"}\nHistorical Data: ${JSON.stringify(historicalData?.slice(-10) || [])}\n\nRespond in JSON with fields: summary, trend, recommendations (array), and always include a motivational message to encourage combating air pollution.`;
  }

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
      // If the response is a string, wrap it in a summary
      if (typeof parsed === 'string') {
        return NextResponse.json({ summary: parsed, trend: '', recommendations: [], motivation: "Together, we can combat air pollution! Every action counts." });
      }
      // If the response is an object, ensure it has at least a summary or message
      if (!parsed.summary && parsed.message) {
        parsed.summary = parsed.message;
      }
      // Ensure recommendations is an array
      if (!Array.isArray(parsed.recommendations)) {
        parsed.recommendations = parsed.recommendations ? [parsed.recommendations] : [];
      }
      // Always include an encouraging message
      if (!parsed.motivation || parsed.motivation.length < 10) {
        parsed.motivation = "Together, we can combat air pollution! Every action counts.";
      }
      // --- Illogical answer fallback logic ---
      const summary = parsed.summary ? parsed.summary.trim() : "";
      // Only fallback if the answer is empty or a clear refusal, otherwise always use the AI's dynamic answer
      const userQuestion = message ? message.toLowerCase() : "";
      const isAboutClimAct = userQuestion.includes("climact");
      const isAboutClimateAction = userQuestion.includes("climate action");
      const isRefusal = /not sure|don't know|no information|cannot answer|i am an ai|as an ai|sorry|unknown|n\/a|no data|unsure|unavailable|not provided|no answer|cannot provide/i.test(summary);
      const isIllogical = !summary || isRefusal;
      if (isIllogical) {
        // Only fallback for truly empty or refusal answers
        if (isAboutClimAct) {
          return NextResponse.json({
            summary: "ClimAct is a platform that empowers users to understand and take action on air quality and climate change. It offers insights, recommendations, and community features to help individuals and organizations make a positive impact.",
            recommendations: [
              "Explore the ClimAct dashboard.",
              "Join the ClimAct community.",
              "Use ClimAct's recommendations to reduce your personal and community emissions."
            ],
            motivation: "Together, we can create a cleaner, healthier future!"
          });
        }
        if (isAboutClimateAction) {
          return NextResponse.json({
            summary: "Climate action refers to efforts to reduce greenhouse gas emissions and strengthen resilience to climate change. Actions can be taken at the individual, community, or government level.",
            recommendations: [
              "Reduce energy use.",
              "Support clean energy policies.",
              "Educate others about climate change."
            ],
            motivation: "Every step counts in combating climate change!"
          });
        }
        return NextResponse.json({
          summary: "Air quality is a crucial aspect of public health and environmental well-being. Poor air quality can lead to respiratory and cardiovascular diseases, harm ecosystems, and contribute to climate change. Everyone can help by reducing emissions, supporting clean energy, and spreading awareness.",
          recommendations: [
            "Use public transport, cycle, or walk instead of driving whenever possible.",
            "Support and advocate for clean energy initiatives in your community.",
            "Reduce, reuse, and recycle to minimize waste and pollution."
          ],
          motivation: "Your actions matter! Together, we can create cleaner air and a healthier planet."
        });
      }
      // Otherwise, always use the AI's dynamic answer
      return NextResponse.json(parsed);
      return NextResponse.json(parsed);
    } catch (e) {
      // If parsing fails, return a high-quality fallback answer
      return NextResponse.json({
        summary: "Air quality is a crucial aspect of public health and environmental well-being. Poor air quality can lead to respiratory and cardiovascular diseases, harm ecosystems, and contribute to climate change. Everyone can help by reducing emissions, supporting clean energy, and spreading awareness.",
        recommendations: [
          "Use public transport, cycle, or walk instead of driving whenever possible.",
          "Support and advocate for clean energy initiatives in your community.",
          "Reduce, reuse, and recycle to minimize waste and pollution."
        ],
        motivation: "Your actions matter! Together, we can create cleaner air and a healthier planet."
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch AI insight', details: error?.toString() }, { status: 500 });
  }
}