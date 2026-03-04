# ⚽ Match Predictor

Dashboard de pronósticos deportivos con IA — powered by **Gemini 2.0 Flash** (gratis) + Google Search.

## 🆓 API Key GRATIS

1. Ve a [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API Key** → cópiala
3. ¡Listo! El tier gratuito incluye 1,500 requests/día

## Deploy en Vercel (5 minutos)

### 1. Sube el proyecto a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/match-predictor.git
git push -u origin main
```

### 2. Conecta con Vercel
1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa tu repositorio de GitHub
3. En **Environment Variables**, agrega:
   - Key: `GEMINI_API_KEY`
   - Value: `AIza...` (tu API key de Google AI Studio)
4. Click **Deploy** ✅

## Desarrollo local

```bash
cp .env.example .env.local
# Edita .env.local con tu API key

npm install
npm run dev
# Abre http://localhost:3000
```

## Funcionalidades
- 🔍 Búsqueda en tiempo real con Google Search
- ⚽ Probabilidades de goles (+1.5, +2.5, +3.5)
- 🚩 Predicciones de córners
- 🟨 Predicciones de tarjetas
- 🏥 Lesionados y suspendidos
- ⚔️ Historial H2H
- 🎯 Marcadores exactos más probables
- 📅 Próximos partidos importantes
