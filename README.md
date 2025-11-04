# AI Disease Outbreak Predictor

![AI Disease Outbreak Predictor UI Screenshot](https://storage.googleapis.com/aistudio-o-prd-12270258-1b2c/public/github/disease-predictor/screenshot.png)

## 📖 Overview

The **AI Disease Outbreak Predictor** is a sophisticated web application that leverages the Google Gemini API to simulate and predict the risk of disease outbreaks. It functions as an interactive dashboard where users can adjust various environmental and epidemiological factors to see their impact on outbreak probability in real-time.

The application is designed to showcase the power of large language models in performing complex data analysis and generating actionable insights, simulating a system that could be used by public health officials or researchers.

---

## ✨ Features

*   **🤖 AI-Powered Predictions**: Utilizes the Gemini API to analyze input factors and predict outbreak probability, model confidence, and risk level.
*   **🎛️ Interactive Controls**: Users can manually adjust risk factors like weather conditions, population density, sanitation levels, and recent case numbers using intuitive sliders.
*   **🌐 Live Data Simulation**: Fetch and simulate realistic public health and environmental data for any city in the world to generate a dynamic, location-based risk assessment.
*   **📊 Rich Data Visualization**:
    *   A dynamic probability gauge that visually represents the current risk level.
    *   A bar chart detailing the contribution of each factor to the overall prediction.
    *   A historical trend chart to track prediction history over time.
    *   A radar chart to visualize the risk factor profile.
*   **🧠 In-Depth AI Analysis**: Generates a qualitative analysis of the risk, including a summary, identification of key drivers, and actionable mitigation strategies.
*   **⚡ Dual AI Models**: Switch between the `gemini-2.5-flash` model for speed and the `gemini-2.5-pro` model for more nuanced analysis.
*   **📱 Responsive Design**: A sleek, modern, and fully responsive UI built with Tailwind CSS that works on all screen sizes.

---

## 🛠️ Tech Stack

*   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **AI/ML**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To get this project up and running on your local machine, follow these simple steps.

### Prerequisites

You need to have a Google Gemini API key to use this application.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **"Create API key"** and copy the generated key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-disease-predictor.git
    cd ai-disease-predictor
    ```

2.  **Install dependencies:**
    This project uses a modern setup with dependencies managed via an `importmap` in `index.html`, so no traditional `npm install` is required if you are running it in a compatible environment.

3.  **Set up your environment variables:**
    Create a file named `.env` in the root of your project and add your Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    The application is configured to read this key from `process.env.API_KEY`.

4.  **Run the application:**
    Serve the `index.html` file using a local development server. If you have Node.js installed, you can use a simple server like `http-server`:
    ```bash
    # If you don't have http-server installed:
    # npm install -g http-server
    
    http-server .
    ```
    Now, open your browser and navigate to the local address provided (e.g., `http://localhost:8080`).

---

## 📂 Project Structure

```
.
├── components/          # Reusable React components
│   ├── ui/              # Generic UI components (Card, PanelLoader)
│   ├── AnalysisPanel.tsx
│   ├── ControlsPanel.tsx
│   ├── Header.tsx
│   ├── PredictionPanel.tsx
│   └── TabNavigation.tsx
├── services/            # API interaction logic
│   └── geminiService.ts   # Functions for calling the Gemini API
├── App.tsx              # Main application component
├── index.html           # Entry point, includes importmap
├── index.tsx            # React root renderer
├── metadata.json        # Application metadata
└── types.ts             # TypeScript type definitions
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
