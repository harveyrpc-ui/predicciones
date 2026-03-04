export const maxDuration = 60;

async function searchWeb(query, tavilyKey) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: tavilyKey,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: true
    })
  });
  const data = await res.json();
  return data.results?.map(r => `${r.title}: ${r.content}`).join("\n\n") || "";
}

const PROMPT_TEMPLATE = (home, away, searchData) => `
Eres un analista deportivo experto. Basándote en esta información REAL y ACTUAL encontrada en internet, analiza el partido ${home} vs ${away}.

DATOS REALES ENCONTRADOS:
${searchData}

Usa esos datos para generar probabilidades y análisis precisos.
Devuelve ÚNICAMENTE un objeto JSON válido (sin texto extra, sin markdown, sin backticks):

{
  "matchup": {
    "home": "${home}",
    "away": "${away}",
    "league": "Liga o competición real",
    "date": "Fecha real del próximo partido"
  },
  "homeTeam": {
    "form": ["W","D","L","W","W"],
    "goalsScored": 2.1,
    "goalsConceded": 1.2,
    "avgCorners": 5.4,
    "avgYellowCards": 1.8,
    "avgRedCards": 0.1,
    "possession": 55,
    "injuries": ["Jugador (zona)"],
    "suspensions": [],
    "keyPlayers": ["Jugador 1", "Jugador 2"],
    "nextImportantMatch": "Próximo partido relevante",
    "recentNews": "Noticia real reciente del equipo"
  },
  "awayTeam": {
    "form": ["L","W","W","D","L"],
    "goalsScored": 1.6,
    "goalsConceded": 1.5,
    "avgCorners": 4.7,
    "avgYellowCards": 2.0,
    "avgRedCards": 0.15,
    "possession": 45,
    "injuries": [],
    "suspensions": ["Jugador"],
    "keyPlayers": ["Jugador A"],
    "nextImportantMatch": "Próximo partido relevante",
    "recentNews": "Noticia real reciente del equipo"
  },
  "headToHead": {
    "matches": 8,
    "homeWins": 3,
    "draws": 2,
    "awayWins": 3,
    "avgGoals": 2.5,
    "lastResults": ["2-1","0-0","1-2","2-2","1-0"]
  },
  "probabilities": {
    "homeWin": 42,
    "draw": 27,
    "awayWin": 31,
    "over15Goals": 75,
    "over25Goals": 52,
    "over35Goals": 29,
    "btts": 49,
    "cleanSheetHome": 30,
    "cleanSheetAway": 25,
    "corners": { "over85": 60, "over105": 35 },
    "cards": { "over25": 55, "over35": 30 },
    "exactScores": [
      {"score": "1-0", "prob": 13},
      {"score": "1-1", "prob": 12},
      {"score": "2-1", "prob": 11},
      {"score": "2-0", "prob": 9},
      {"score": "0-1", "prob": 8}
    ]
  },
  "verdict": {
    "prediction": "Resultado más probable",
    "confidence": 65,
    "bestBet": "Mercado recomendado",
    "keyFactors": ["Factor 1", "Factor 2", "Factor 3"],
    "riskLevel": "Medio",
    "summary": "Análisis de 2-3 oraciones basado en datos reales."
  }
}`;

export async function POST(request) {
  const groqKey = process.env.GROQ_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;

  if (!groqKey || !tavilyKey) {
    return Response.json({ error: "API keys not configured" }, { status: 500 });
  }

  const { home, away } = await request.json();
  if (!home || !away) {
    return Response.json({ error: "Missing teams" }, { status: 400 });
  }

  // Búsquedas en paralelo para datos actuales
  const [news, injuries, stats, h2h] = await Promise.all([
    searchWeb(`${home} vs ${away} próximo partido 2025 fecha`, tavilyKey),
    searchWeb(`${home} lesionados suspendidos 2025 ${away}`, tavilyKey),
    searchWeb(`${home} ${away} estadísticas forma reciente goles 2025`, tavilyKey),
    searchWeb(`${home} vs ${away} historial head to head resultados`, tavilyKey),
  ]);

  const searchData = `=== PARTIDO Y FECHA ===\n${news}\n\n=== LESIONADOS Y SUSPENDIDOS ===\n${injuries}\n\n=== ESTADÍSTICAS Y FORMA ===\n${stats}\n\n=== HISTORIAL H2H ===\n${h2h}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: "Eres un analista deportivo experto. Siempre respondes SOLO con JSON válido, sin texto extra ni markdown."
        },
        {
          role: "user",
          content: PROMPT_TEMPLATE(home, away, searchData)
        }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content || "";
  const clean = rawText.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1) {
    return Response.json({ error: "No JSON found" }, { status: 500 });
  }

  try {
    const parsed = JSON.parse(clean.slice(start, end + 1));
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Invalid JSON from AI" }, { status: 500 });
  }
}
