/* src/components/AIChartAnalysis.tsx */
import { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

const API = "http://localhost:8000/api";

interface AIChartAnalysisProps {
  chartId?: string;
  symbol: string;
}

export default function AIChartAnalysis({ chartId = "stock-chart", symbol }: AIChartAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  const captureAndAnalyzeChart = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);
    setCapturedImage(null);

    try {
      // Find the chart element to capture
      const chartElement = document.getElementById(chartId);
             
      if (!chartElement) {
        setError("Chart element not found. Please ensure the chart is visible.");
        setLoading(false);
        return;
      }

      // Capture the chart as an image
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        height: chartElement.offsetHeight,
        width: chartElement.offsetWidth,
      });
      
      const fullImageData = canvas.toDataURL("image/png");
      const base64Image = fullImageData.split(",")[1];
      
      // Store the captured image for display
      setCapturedImage(fullImageData);

      // Send the image to backend for analysis
      const response = await axios.post(`${API}/analyze-chart/`, {
        image: base64Image,
        symbol: symbol
      });

      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to analyze chart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = `${symbol}-chart-analysis-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = capturedImage;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow shadow-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AI Chart Analysis</h2>
        <button
          onClick={captureAndAnalyzeChart}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Chart"}
        </button>
      </div>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Capturing chart and analyzing with AI...</span>
        </div>
      )}

      {/* Results section - only show if we have either image or analysis */}
      {(capturedImage || analysis) && !loading && (
        <div className="space-y-6">
          
          {/* Captured Image Section */}
          {capturedImage && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">📸 Chart Image Sent to AI Model</span>
                  <span className="text-xs text-gray-500">({symbol})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowImage(!showImage)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    {showImage ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
              
              {showImage && (
                <div className="p-4 bg-white">
                  <img 
                    src={capturedImage} 
                    alt={`${symbol} Chart Analysis`}
                    className="w-full h-auto border border-gray-200 rounded shadow-sm"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This is the exact image that was sent to the AI model for analysis
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis Section */}
          {analysis && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  🤖 AI Technical Analysis for {symbol}
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Generated {new Date().toLocaleTimeString()}
                  </span>
                </h3>
              </div>
              <div className="p-4 bg-green-50">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {analysis}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial state message */}
      {!capturedImage && !analysis && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>Click "Analyze Chart" to capture the current chart and get AI-powered technical analysis</p>
          <p className="text-sm mt-2">The captured image will be displayed here so you can see exactly what was analyzed</p>
        </div>
      )}
    </div>
  );
}