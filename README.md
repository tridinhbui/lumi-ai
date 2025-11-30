# lumi-ai

Lumi is a strategic AI assistant for case competition analysis. It helps users analyze business cases, extract insights from documents, and create structured solutions with visualizations.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Create a `.env.local` file and set the following environment variables:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key (get from [Google AI Studio](https://aistudio.google.com/apikey))
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))
   - `VITE_SUPABASE_URL`: (Optional) Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: (Optional) Your Supabase anonymous key
3. Run the app:
   `npm run dev`
   
   The app will run on `http://localhost:3000` only.

## Routes

- `/` - Login page (auto-redirects to case-interview)
- `/case-interview` - Case Interview Simulator
- `/analytics` - Lumi AI Assistant with PDF Viewer and Dashboard

## Features

### Lumi AI Assistant
- **Chat Interface**: Interactive AI assistant for case analysis
- **PDF Viewer**: Real-time PDF viewing when files are uploaded
- **Dashboard**: Charts, maps, and insights visualization
- **File Upload**: Support for PDF, slides, and images
- **Framework Suggestions**: MECE, Porter's 5 Forces, and more
- **Responsive Design**: Works on desktop and mobile devices

### Case Interview Simulator
- Interactive case interview practice
- Real-time feedback and assessment
- Structured case solving approach
