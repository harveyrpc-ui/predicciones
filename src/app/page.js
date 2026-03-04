"use client";
import { useState, useEffect } from "react";

function FormBadge({ result }) {
  const colors = { W: "#00e676", D: "#ffeb3b", L: "#f44336" };
  const labels = { W: "G", D: "E", L: "P" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 26, height: 26, borderRadius: "50%",
      background: colors[result] + "22", border: `1.5px solid ${colors[result]}`,
      color: colors[result], fontSize: 11, fontWeight: 700, fontFamily: "monospace"
    }}>{labels[result]}</span>
  );
}

function ProbBar({ label, value, color = "#00e676" }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${value}%`, height: "100%", borderRadius: 4,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }} />
      </div>
    </div>
  );
}

function StatRow({ icon, label, home, away }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", gap: 8, padding: "8px 0",
      borderBottom: "1px solid #1e293b"
    }}>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{home}</div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#475569", whiteSpace: "nowrap", minWidth: 100 }}>
        {icon} {label}
      </div>
      <div style={{ textAlign: "left", fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{away}</div>
    </div>
  );
}

function ScoreCard({ score, prob }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8,
      padding: "8px 12px", textAlign: "center"
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", fontFamily: "monospace" }}>{score}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{prob}%</div>
    </div>
  );
}

export default function Home() {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (data) setTimeout(() => setAnimated(true), 100);
    else setAnimated(false);
  }, [data]);

  async function analyze() {
    if (!home.trim() || !away.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home: home.trim(), away: away.trim() })
      });

      if (!res.ok) throw new Error(await res.text());
      const parsed = await res.json();
      setData(parsed);
    } catch (e) {
      setError("Error al obtener el análisis. Verifica los nombres de los equipos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const riskColor = { "Bajo": "#00e676", "Medio": "#ffeb3b", "Alto": "#f44336" };

  return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      fontFamily: "'Georgia', serif", color: "#e2e8f0", padding: "0 0 60px 0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0a1628 0%, #020817 100%)",
        borderBottom: "1px solid #1e293b", padding: "28px 24px 24px",
        textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 0%, #1e3a5f33 0%, transparent 70%)"
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#3b82f6", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>
            ⚽ SPORTS INTELLIGENCE
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 900, margin: 0,
            background: "linear-gradient(135deg, #f1f5f9 30%, #3b82f6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1
          }}>
            Match Predictor
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "8px 0 0", fontFamily: "monospace" }}>
            Análisis estadístico · IA + Datos en tiempo real
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 0" }}>
        <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
            <input value={home} onChange={e => setHome(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Equipo Local"
              style={{
                background: "#020817", border: "1px solid #1e293b", borderRadius: 10,
                padding: "12px 16px", color: "#f1f5f9", fontSize: 15, fontWeight: 600,
                width: "100%", boxSizing: "border-box", outline: "none", textAlign: "center", fontFamily: "'Georgia', serif"
              }}
            />
            <div style={{
              width: 36, height: 36, background: "#1e293b", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#64748b", fontWeight: 700, flexShrink: 0
            }}>VS</div>
            <input value={away} onChange={e => setAway(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Equipo Visitante"
              style={{
                background: "#020817", border: "1px solid #1e293b", borderRadius: 10,
                padding: "12px 16px", color: "#f1f5f9", fontSize: 15, fontWeight: 600,
                width: "100%", boxSizing: "border-box", outline: "none", textAlign: "center", fontFamily: "'Georgia', serif"
              }}
            />
          </div>
          <button onClick={analyze} disabled={loading || !home.trim() || !away.trim()} style={{
            marginTop: 16, width: "100%", padding: "14px",
            background: loading ? "#1e293b" : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: 1,
            textTransform: "uppercase", fontFamily: "monospace", transition: "all 0.2s"
          }}>
            {loading ? "🔍 Analizando con IA..." : "⚡ Analizar Partido"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, background: "#2d0a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: 12, fontSize: 13, color: "#fca5a5", textAlign: "center" }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: "spin 2s linear infinite", display: "inline-block" }}>⚽</div>
            <div style={{ fontSize: 13, fontFamily: "monospace" }}>Buscando datos en tiempo real...</div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* Results */}
      {data && (
        <div style={{
          maxWidth: 900, margin: "28px auto 0", padding: "0 20px",
          opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {/* Match Header */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a5f)", border: "1px solid #1e3a5f",
            borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 20
          }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>
              {data.matchup.league} · {data.matchup.date}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>{data.matchup.home}</div>
              <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "6px 16px", fontSize: 13, color: "#64748b", fontFamily: "monospace" }}>vs</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>{data.matchup.away}</div>
            </div>
          </div>

          {/* Verdict */}
          <div style={{
            background: "#0f172a", border: `1px solid ${riskColor[data.verdict.riskLevel] || "#3b82f6"}44`,
            borderRadius: 16, padding: 24, marginBottom: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>🏆 Pronóstico Principal</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9" }}>{data.verdict.prediction}</div>
                <div style={{ fontSize: 13, color: "#3b82f6", marginTop: 6 }}>🎯 Mejor apuesta: {data.verdict.bestBet}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>Confianza</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: data.verdict.confidence >= 70 ? "#00e676" : data.verdict.confidence >= 50 ? "#ffeb3b" : "#f44336" }}>
                  {data.verdict.confidence}%
                </div>
                <div style={{
                  display: "inline-block", padding: "3px 10px", borderRadius: 20,
                  background: (riskColor[data.verdict.riskLevel] || "#3b82f6") + "22",
                  border: `1px solid ${riskColor[data.verdict.riskLevel] || "#3b82f6"}44`,
                  color: riskColor[data.verdict.riskLevel] || "#3b82f6",
                  fontSize: 11, fontFamily: "monospace"
                }}>Riesgo {data.verdict.riskLevel}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 16, lineHeight: 1.7, borderTop: "1px solid #1e293b", paddingTop: 16 }}>
              {data.verdict.summary}
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {data.verdict.keyFactors.map((f, i) => (
                <span key={i} style={{ background: "#1e293b", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "#94a3b8" }}>▸ {f}</span>
              ))}
            </div>
          </div>

          {/* Probabilities */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>📊 Resultado</div>
              <ProbBar label={`Victoria ${data.matchup.home}`} value={data.probabilities.homeWin} color="#3b82f6" />
              <ProbBar label="Empate" value={data.probabilities.draw} color="#ffeb3b" />
              <ProbBar label={`Victoria ${data.matchup.away}`} value={data.probabilities.awayWin} color="#f97316" />
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>⚽ Goles</div>
              <ProbBar label="+1.5 goles" value={data.probabilities.over15Goals} color="#00e676" />
              <ProbBar label="+2.5 goles" value={data.probabilities.over25Goals} color="#00e676" />
              <ProbBar label="+3.5 goles" value={data.probabilities.over35Goals} color="#00b248" />
              <ProbBar label="Ambos marcan" value={data.probabilities.btts} color="#06b6d4" />
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>🚩 Córners & 🟨 Tarjetas</div>
              <ProbBar label="+8.5 córners" value={data.probabilities.corners.over85} color="#a855f7" />
              <ProbBar label="+10.5 córners" value={data.probabilities.corners.over105} color="#7c3aed" />
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12, marginTop: 4 }}>
                <ProbBar label="+2.5 tarjetas" value={data.probabilities.cards.over25} color="#f59e0b" />
                <ProbBar label="+3.5 tarjetas" value={data.probabilities.cards.over35} color="#d97706" />
              </div>
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>🎯 Marcadores Exactos</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {data.probabilities.exactScores.map((s, i) => <ScoreCard key={i} score={s.score} prob={s.prob} />)}
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              { team: data.homeTeam, name: data.matchup.home, color: "#3b82f6" },
              { team: data.awayTeam, name: data.matchup.away, color: "#f97316" }
            ].map(({ team, name, color }) => (
              <div key={name} style={{ background: "#0f172a", border: `1px solid ${color}22`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color }}>{name}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {team.form?.map((r, i) => <FormBadge key={i} result={r} />)}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "Goles/partido", val: team.goalsScored, icon: "⚽" },
                    { label: "Goles rec.", val: team.goalsConceded, icon: "🥅" },
                    { label: "Córners/ptdo", val: team.avgCorners, icon: "🚩" },
                    { label: "Tarjetas am.", val: team.avgYellowCards, icon: "🟨" },
                    { label: "Tarjetas ro.", val: team.avgRedCards, icon: "🟥" },
                    { label: "Posesión", val: `${team.possession}%`, icon: "📊" },
                  ].map(({ label, val, icon }) => (
                    <div key={label} style={{ background: "#020817", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "monospace" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {team.injuries?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "#f87171", marginBottom: 6, fontFamily: "monospace" }}>🏥 LESIONADOS ({team.injuries.length})</div>
                    {team.injuries.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#fca5a5", padding: "3px 0" }}>• {p}</div>)}
                  </div>
                )}

                {team.suspensions?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "#fbbf24", marginBottom: 6, fontFamily: "monospace" }}>🟨 SUSPENDIDOS</div>
                    {team.suspensions.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#fde68a", padding: "3px 0" }}>• {p}</div>)}
                  </div>
                )}

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#34d399", marginBottom: 6, fontFamily: "monospace" }}>⭐ JUGADORES CLAVE</div>
                  {team.keyPlayers?.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#6ee7b7", padding: "3px 0" }}>• {p}</div>)}
                </div>

                <div style={{ background: "#020817", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontFamily: "monospace" }}>📅 PRÓXIMO PARTIDO IMPORTANTE</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{team.nextImportantMatch}</div>
                </div>

                <div style={{ background: color + "11", border: `1px solid ${color}22`, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, color, marginBottom: 4, fontFamily: "monospace" }}>📰 NOTICIAS</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{team.recentNews}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Head to Head */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, fontFamily: "monospace" }}>
              ⚔️ Historial H2H ({data.headToHead.matches} partidos)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: `Victorias\n${data.matchup.home}`, val: data.headToHead.homeWins, color: "#3b82f6" },
                { label: "Empates", val: data.headToHead.draws, color: "#ffeb3b" },
                { label: `Victorias\n${data.matchup.away}`, val: data.headToHead.awayWins, color: "#f97316" },
                { label: "Goles\npromedio", val: data.headToHead.avgGoals, color: "#00e676" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ textAlign: "center", background: "#020817", borderRadius: 10, padding: "14px 8px" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "monospace", marginBottom: 4 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#475569", whiteSpace: "pre-line", lineHeight: 1.4 }}>{label}</div>
                </div>
              ))}
            </div>
            <StatRow icon="⚽" label="Goles/partido" home={data.homeTeam.goalsScored} away={data.awayTeam.goalsScored} />
            <StatRow icon="🚩" label="Córners/partido" home={data.homeTeam.avgCorners} away={data.awayTeam.avgCorners} />
            <StatRow icon="🟨" label="Tarjetas am./partido" home={data.homeTeam.avgYellowCards} away={data.awayTeam.avgYellowCards} />
            <StatRow icon="📊" label="Posesión" home={`${data.homeTeam.possession}%`} away={`${data.awayTeam.possession}%`} />
          </div>

          <div style={{ textAlign: "center", fontSize: 11, color: "#334155", fontFamily: "monospace", paddingTop: 8 }}>
            Análisis generado con IA · Solo con fines informativos · No es asesoría de apuestas
          </div>
        </div>
      )}
    </div>
  );
}
