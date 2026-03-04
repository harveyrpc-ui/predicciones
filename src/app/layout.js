export const metadata = {
  title: "Match Predictor · Pronósticos con IA",
  description: "Análisis estadístico de partidos de fútbol con inteligencia artificial",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
