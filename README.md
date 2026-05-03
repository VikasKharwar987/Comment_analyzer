# 🔍 YouTube Comment Toxicity Analyzer

A full-stack web application that analyzes YouTube video comments for toxicity using a fine-tuned multilingual ML model. Paste any YouTube link and instantly get an interactive analytics dashboard showing how toxic the comment section is — with trends over time, category breakdowns, and more.

> ⚠️ **Disclaimer:** This tool uses an ML model for toxicity detection. Predictions may not always be accurate. Do not use this for making critical decisions about individuals or communities. Use it as a rough analytical guide only.

---

## ✨ What It Does

1. **Paste a YouTube video URL** — the app extracts the video ID and calls the YouTube Data API v3 to fetch up to 500 top-level comments along with their timestamps.
2. **ML inference runs in parallel** — comments are batched (50 per batch, 3 concurrent workers) and sent to a Hugging Face Space hosting a toxicity classifier. Each comment receives a `toxic_score` confidence value.
3. **Labels are assigned by threshold:**
   - `≥ 0.7` → 🔴 **TOXIC**
   - `0.3 – 0.69` → 🟡 **MILD TOXIC**
   - `< 0.3` → 🟢 **SAFE**
4. **An interactive dashboard renders instantly** with:
   - KPI cards (total, toxic, mild, safe counts + percentages)
   - Donut pie chart + bar chart for category distribution
   - Stacked area chart — comment volume over time (all 3 categories)
   - Toxicity rate % line chart — what % of comments in each period were toxic
   - Per-category area charts (Toxic / Mild Toxic / Safe)
   - Dynamic X-axis that adapts to the actual date range of the data (minutes → months)
   - Rich hover tooltips showing the exact date range, counts, and toxicity rate

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                  React Frontend                  │
│  HomePage  →  paste YouTube URL  →  DashboardPage│
│  recharts  │  lucide-react  │  react-router-dom  │
└──────────────────┬───────────────────────────────┘
                   │ GET /analyze?video_url=...
┌──────────────────▼───────────────────────────────┐
│              FastAPI Backend (Python)            │
│                                                  │
│  youtube_service.py                              │
│    └─ YouTube Data API v3 → fetch 500 comments  │
│                                                  │
│  analysis_service.py                             │
│    └─ Batch comments → HF Space /predict API    │
│    └─ Assign TOXIC / MILD TOXIC / SAFE labels   │
└──────────────────┬───────────────────────────────┘
                   │ POST /predict (batches of 50)
┌──────────────────▼───────────────────────────────┐
│     Hugging Face Space — Toxicity Classifier     │
│     kharwar1011/toxicity-api                     │
│     Returns toxic_score (0.0 – 1.0) per comment │
└──────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Create React App), Recharts, Lucide React, React Router DOM |
| **Backend** | Python, FastAPI, aiohttp, concurrent.futures |
| **ML API** | Hugging Face Spaces (custom toxicity classifier) |
| **Data Source** | YouTube Data API v3 |
| **Styling** | Tailwind CSS with glassmorphism design, dark/light mode |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- A **YouTube Data API v3** key ([get one here](https://console.developers.google.com/))

### 1. Clone the repo

```bash
git clone https://github.com/VikasKharwar987/Comment_analyzer.git
cd Comment_analyzer
```

### 2. Backend setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo YT_TOKEN=your_youtube_api_key_here > .env
```

### 3. Start the backend

```bash
uvicorn api.main:app --reload
```

The API runs at `http://localhost:8000`.

### 4. Frontend setup

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
YT_TOKEN=your_youtube_data_api_v3_key
```

> The Hugging Face inference endpoint is hardcoded in `api/services/analysis_service.py`. No additional API key is needed for it.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/analyze?video_url=<url>` | Fetches + analyzes comments for a YouTube video |
| `POST` | `/predict` | Direct text toxicity prediction (single input) |

### Example response from `/analyze`

```json
{
  "total": 500,
  "toxic": 68,
  "mild_toxic": 14,
  "safe": 418,
  "details": [
    {
      "text": "This comment text...",
      "timestamp": "2024-05-12T10:04:21Z",
      "label": "SAFE",
      "confidence": 0.0008
    }
  ]
}
```

---

## 📊 Dashboard Charts — Explained in Plain English

The dashboard has **7 visual elements** arranged top to bottom. Here's what each one tells you and why it's useful:

---

### 1. 🟦 KPI Cards (Top Row)

> *"The scoreboard at the top"*

Four summary boxes showing:
- **Total Comments** — how many comments were fetched and analyzed
- **Toxic** — count + % of comments the model flagged as genuinely harmful (confidence ≥ 70%)
- **Mild Toxic** — count + % of borderline comments (confidence 30–69%)
- **Safe** — count + % of normal, non-harmful comments

**Why it's useful:** You get the big picture instantly without reading a single comment. If 40% are toxic, you know the comment section is hostile before looking at anything else.

---

### 2. 🍩 Donut Pie Chart (Left)

> *"A visual slice of how toxic the comment section is"*

A ring chart divided into three colored segments:
- 🔴 Red = Toxic
- 🟡 Yellow = Mild Toxic
- 🟢 Green = Safe

The **number in the center** is the total comment count. The size of each slice is proportional to that category's share.

**Why it's useful:** Instantly tells you the *ratio* of toxic vs. safe content at a glance — like a health gauge for the comment section.

---

### 3. 📊 Bar Chart (Right)

> *"A side-by-side height comparison of the three categories"*

Three bars — one per category — where the **height = number of comments** in that category. The exact count is shown on top of each bar.

**Why it's useful:** While the pie chart shows proportions, the bar chart shows absolute numbers. For example, if there are 400 safe comments and 80 toxic — the pie looks 80% green, but the bar shows you there are still **80 toxic comments** which could be a lot.

---

### 4. 📈 Stacked Area Chart — "Comment Volume Over Time"

> *"When were people commenting, and was it toxic or safe?"*

This is the **main timeline chart**. The X-axis is time (from the first comment ever posted to the most recent one). The Y-axis is the number of comments. The chart is **stacked** — meaning the three categories are layered on top of each other:
- 🟢 Green (Safe) fills the bottom
- 🟡 Yellow (Mild Toxic) sits on top of green
- 🔴 Red (Toxic) sits on top of yellow

**What you'll typically see:**
- A **huge spike** right after the video was published (everyone comments when a video is new)
- A **long flat tail** as fewer and fewer people comment over months/years
- If there's a **red spike at an unusual time**, it could mean the video went viral again (controversy, repost, etc.)

**Why it's useful:** You can see *when* the comment activity happened and *what kind* of comments were being posted at each point in time — all in one chart.

---

### 5. 📉 Toxicity Rate Over Time — "% Toxic Per Period"

> *"Is the toxicity concentrated in a specific time window?"*

This line chart shows the **percentage of toxic comments** in each time bucket — not the raw count. For example, if in June 2024 there were 10 comments and 5 were toxic, the line shows 50% for that period.

**Why it's different from the stacked area chart:**
The stacked area chart shows *volume* (how many comments). This chart shows *rate* (what % were toxic). A period with 2 total comments but both toxic = 100% rate, which would be invisible in the volume chart but a huge spike here.

**What to look for:**
- **Spikes** = time periods where a higher proportion of comments were toxic (maybe a controversial moment happened)
- **Gaps** in the line = time periods where no comments exist at all (the model skips those rather than showing fake zeros)

**Why it's useful:** Reveals *targeted toxicity bursts* that pure volume charts can miss.

---

### 6–8. 🔴🟡🟢 Per-Category Area Charts (Bottom Row)

> *"A dedicated timeline for each type of comment separately"*

Three individual charts, one per category:
- **Toxic Comments** — shows only when toxic comments were posted over time
- **Mild Toxic Comments** — shows only the borderline comments
- **Safe Comments** — shows only the harmless comments

Each has the same X-axis time range as the main charts, so you can compare them side by side.

**Why they're useful:** The combined stacked chart can be hard to read when categories overlap. These mini charts let you focus on just one type. For example:
- The safe chart typically has the biggest spike at release
- The toxic chart might spike *days later* when drama/controversy hits
- If the mild toxic chart is flat, it suggests comments are mostly binary (either clearly toxic or clearly fine)

---

### 🕐 How the X-Axis Works (All Charts)

The time axis **automatically adapts** to the date range of your data:

| Data spans | Tick labels look like |
|---|---|
| A few hours | `12 May 09:00`, `12 May 10:00` |
| Days to weeks | `12 May '24`, `19 May '24` |
| Months to years | `May '24`, `Aug '24`, `Jan '25` |

The axis always shows **7 evenly-spaced labels** from the **exact timestamp of the first comment** to the **exact timestamp of the last comment** — pulled directly from the YouTube API response.


---

## 📁 Project Structure

```
Comment-toxiticity-differencer/
├── api/
│   ├── main.py                  # FastAPI app, CORS, router registration
│   ├── routes/
│   │   └── analyze.py           # GET /analyze endpoint
│   └── services/
│       ├── youtube_service.py   # YouTube Data API v3 integration
│       └── analysis_service.py  # Batch ML inference + label assignment
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx     # URL input page
│       │   └── DashboardPage.jsx # Analytics dashboard
│       ├── components/
│       │   └── StatCard.jsx     # KPI card component
│       └── services/
│           └── api.js           # Frontend API client
├── notebooks/                   # Jupyter notebooks for model training/prep
├── src/                         # ML model source code
├── .env                         # API keys (not committed)
└── requirements.txt
```

---

## ⚠️ Known Limitations

- **Rate limiting:** YouTube Data API v3 has a daily quota. Analyzing multiple videos quickly may exhaust it.
- **Model accuracy:** The Hugging Face toxicity model is not perfect. Sarcasm, coded language, and non-English comments may be misclassified.
- **Comment ordering:** Comments are fetched ordered by relevance (YouTube's default), not by date. Timestamps still reflect when comments were actually posted.
- **Max 500 comments:** The backend is capped at 500 comments per analysis to keep inference time reasonable.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.