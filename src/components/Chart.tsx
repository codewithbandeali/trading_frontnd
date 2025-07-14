// import { useState, useEffect, FormEvent } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";
// import AIChartAnalysis from "./AIChartAnalysis";
// import { AIScreenCapture } from "./AIScreenCapture";

// const API = "http://localhost:8000/api";

// const TF = [
//   { lbl: "1H", res: "60", qs: "lookback=48" },
//   { lbl: "1D", res: "D",  qs: "lookback=400" },
//   { lbl: "1W", res: "W",  qs: "lookback=800" },
//   { lbl: "1M", res: "M",  qs: "lookback=2000" },
// ];

// // Enhanced formatSeriesName function with comprehensive mapping
// const formatSeriesName = (name: string) => {
//   const lowerName = name.toLowerCase();
  
//   const nameMap: { [key: string]: string } = {
//     // Legacy pandas_ta names
//     'ma20': 'Moving Average (20)', 'ma50': 'Moving Average (50)', 'ma10': 'Moving Average (10)',
//     'ma100': 'Moving Average (100)', 'ma200': 'Moving Average (200)',
//     'MACD_12_26_9': 'MACD Line', 'MACDh_12_26_9': 'MACD Histogram', 'MACDs_12_26_9': 'MACD Signal',
//     'RSI_14': 'RSI (14)', 'RSI_21': 'RSI (21)', 'ADX_14': 'ADX (14)', 'DMP_14': 'DI+ (14)', 'DMN_14': 'DI- (14)',
//     'BBL_20_2.0': 'Bollinger Lower', 'BBM_20_2.0': 'Bollinger Middle', 'BBU_20_2.0': 'Bollinger Upper',
//     'BBL_20_2': 'Bollinger Lower', 'BBM_20_2': 'Bollinger Middle', 'BBU_20_2': 'Bollinger Upper',
//     'STOCHk_14_3_3': 'Stochastic %K', 'STOCHd_14_3_3': 'Stochastic %D',
//     'WILLR_14': 'Williams %R', 'CCI_14': 'CCI (14)', 'ROC_10': 'Rate of Change',
//     'OBV': 'On Balance Volume', 'cdl_doji': 'Doji Pattern',
//     'Dividends': 'Dividend Events', 'Stock Splits': 'Stock Split Events',
    
//     // Backend snake_case names
//     'price': 'Price',
    
//     // Moving Averages
//     'sma_5': 'SMA (5)', 'sma_10': 'SMA (10)', 'sma_20': 'SMA (20)', 'sma_50': 'SMA (50)',
//     'sma_100': 'SMA (100)', 'sma_200': 'SMA (200)',
//     'ema_9': 'EMA (9)', 'ema_12': 'EMA (12)', 'ema_21': 'EMA (21)', 'ema_26': 'EMA (26)',
//     'ema_50': 'EMA (50)', 'ema_100': 'EMA (100)', 'ema_200': 'EMA (200)',
//     'wma_20': 'WMA (20)', 'hma_20': 'Hull MA (20)', 'vwma_20': 'VWMA (20)',
//     't3_20': 'T3 MA (20)', 'zlema_20': 'ZLEMA (20)', 'tema_20': 'TEMA (20)',
//     'dema_20': 'DEMA (20)', 'kama': 'Kaufman Adaptive MA',
    
//     // MACD
//     'macd': 'MACD Line', 'macd_signal': 'MACD Signal', 'macd_histogram': 'MACD Histogram',
//     'macdh_separate': 'MACD Histogram',
    
//     // RSI
//     'rsi': 'RSI (14)', 'rsi_fast': 'RSI Fast', 'rsi_slow': 'RSI Slow',
    
//     // Bollinger Bands
//     'bb_lower': 'Bollinger Lower', 'bb_middle': 'Bollinger Middle', 'bb_upper': 'Bollinger Upper',
//     'bb_width': 'Bollinger Width', 'bb_percent': 'Bollinger %B',
    
//     // Keltner Channels
//     'kc_lower': 'Keltner Lower', 'kc_middle': 'Keltner Middle', 'kc_upper': 'Keltner Upper',
    
//     // Donchian Channels
//     'dc_lower': 'Donchian Lower', 'dc_middle': 'Donchian Middle', 'dc_upper': 'Donchian Upper',
    
//     // ADX
//     'adx': 'ADX (14)', 'dmp': 'DI+ (14)', 'dmn': 'DI- (14)', 'dm_plus': 'DI+', 'dm_minus': 'DI-',
    
//     // Stochastic
//     'stoch_k': 'Stochastic %K', 'stoch_d': 'Stochastic %D',
//     'stochrsi_k': 'StochRSI %K', 'stochrsi_d': 'StochRSI %D',
    
//     // Williams %R
//     'williams_r': 'Williams %R',
    
//     // CCI
//     'cci': 'CCI (14)',
    
//     // Volume
//     'volume': 'Volume', 'obv': 'On Balance Volume', 'ad': 'Accumulation/Distribution',
//     'cmf': 'Chaikin Money Flow', 'volume_roc': 'Volume ROC', 'pvt': 'Price Volume Trend',
//     'vwap': 'VWAP', 'nvi': 'Negative Volume Index', 'pvi': 'Positive Volume Index',
//     'fi': 'Force Index', 'eom': 'Ease of Movement', 'adosc': 'Chaikin Oscillator',
//     'kvo': 'Klinger Volume Oscillator', 'vzo': 'Volume Zone Oscillator',
    
//     // Volatility
//     'atr': 'Average True Range', 'true_range': 'True Range', 'natr': 'Normalized ATR',
//     'chaikin_vol': 'Chaikin Volatility',
    
//     // Momentum
//     'mom': 'Momentum', 'momentum_5': 'Momentum (5)', 'momentum_10': 'Momentum (10)', 'momentum_20': 'Momentum (20)',
//     'roc': 'Rate of Change', 'rocp': 'ROC Percentage',
    
//     // Advanced Oscillators
//     'mfi': 'Money Flow Index', 'tsi': 'True Strength Index', 'tsi_signal': 'TSI Signal',
//     'cmo': 'Chande Momentum Oscillator', 'stc': 'Schaff Trend Cycle',
//     'trix': 'TRIX', 'uo': 'Ultimate Oscillator', 'ao': 'Awesome Oscillator',
//     'fisher': 'Fisher Transform', 'fisher_signal': 'Fisher Signal',
//     'rvi': 'Relative Vigor Index', 'rvi_signal': 'RVI Signal',
//     'csi': 'Commodity Selection Index', 'wad': 'Williams AD',
//     'zscore': 'Z-Score', 'percentrank': 'Percent Rank',
    
//     // Trend Indicators
//     'psar': 'Parabolic SAR', 'trend_strength': 'Trend Strength', 'volatility_rank': 'Volatility Rank',
//     'price_position': 'Price Position', 'linreg': 'Linear Regression', 'ht_trendline': 'Hilbert Trendline',
//     'vortex_pos': 'Vortex Positive', 'vortex_neg': 'Vortex Negative',
    
//     // Ichimoku
//     'ichimoku_a': 'Ichimoku Senkou A', 'ichimoku_b': 'Ichimoku Senkou B', 
//     'ichimoku_base': 'Ichimoku Base', 'ichimoku_conv': 'Ichimoku Conversion',
//     'ichimoku_span': 'Ichimoku Span',
    
//     // Aroon
//     'aroon_up': 'Aroon Up', 'aroon_down': 'Aroon Down', 'aroon_osc': 'Aroon Oscillator',
    
//     // PPO
//     'ppo': 'PPO', 'ppo_signal': 'PPO Signal', 'ppo_histogram': 'PPO Histogram',
    
//     // Support/Resistance
//     'pivot': 'Pivot Point', 'r1': 'Resistance 1', 's1': 'Support 1', 'r2': 'Resistance 2', 's2': 'Support 2',
//     'fib_support': 'Fibonacci Support', 'fib_resistance': 'Fibonacci Resistance',
//     'floor': 'Floor', 'ceiling': 'Ceiling',
    
//     // Candlestick Patterns
//     'doji': 'Doji Pattern', 'hammer': 'Hammer Pattern', 'shooting_star': 'Shooting Star Pattern',
//     'engulfing_bullish': 'Bullish Engulfing', 'engulfing_bearish': 'Bearish Engulfing',
//     'morning_star': 'Morning Star', 'evening_star': 'Evening Star',
    
//     // Events
//     'dividends': 'Dividend Events', 'stock_splits': 'Stock Split Events'
//   };

//   // 1. Exact match (case-sensitive)
//   if (nameMap[name]) return nameMap[name];
  
//   // 2. Exact match (lowercase)
//   if (nameMap[lowerName]) return nameMap[lowerName];

//   // 3. Dynamic pattern matching
//   const maMatch = lowerName.match(/^(s|e|w|h|t3|tema|dema|zlema|vwma|kama)?ma[_]?(\d+)$/);
//   if (maMatch) {
//     const type = maMatch[1] ? maMatch[1].toUpperCase() + ' ' : '';
//     return `${type}MA (${maMatch[2]})`;
//   }

//   if (lowerName.startsWith('rsi_')) {
//     const period = name.split('_')[1];
//     return `RSI (${period})`;
//   }

//   if (lowerName.startsWith('adx_')) {
//     const period = name.split('_')[1];
//     return `ADX (${period})`;
//   }

//   if (lowerName.startsWith('aroon_')) {
//     return 'Aroon';
//   }

//   // Candlestick patterns
//   if (lowerName.startsWith('cdl_') || 
//       ['doji', 'hammer', 'shooting_star', 'engulfing_bullish', 'engulfing_bearish'].includes(lowerName)) {
//     return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Pattern';
//   }

//   return name; // fallback
// };

// // Enhanced indicator colors - supporting both snake_case and pandas_ta naming
// const INDICATOR_COLORS: { [key: string]: string } = {
//   // ---- Candlestick ----
//   price: '#008FFB',           // Blue for candlesticks
  
//   // ---- Moving Averages (both naming conventions) ----
//   ma20: '#FF4560', sma_20: '#FF4560',           // Red for MA20
//   ma50: '#775DD0', sma_50: '#775DD0',           // Purple for MA50
//   ma10: '#FEB019', sma_10: '#FEB019',           // Orange for MA10
//   ma100: '#00E396', sma_100: '#00E396',         // Green for MA100
//   ma200: '#FF69B4', sma_200: '#FF69B4',        // Pink for MA200
//   ma5: '#FFA500', sma_5: '#FFA500',             // Orange for MA5
  
//   // EMA family
//   ema_9: '#FF6B6B', ema_12: '#4ECDC4', ema_21: '#45B7D1', ema_26: '#96CEB4',
//   ema_50: '#FFEAA7', ema_100: '#DDA0DD', ema_200: '#98D8C8',
  
//   // Other MA types
//   wma_20: '#FF7F50', hma_20: '#32CD32', vwma_20: '#8A2BE2',
//   t3_20: '#DC143C', zlema_20: '#00CED1', tema_20: '#FF1493',
//   dema_20: '#228B22', kama: '#B22222',
  
//   // ---- MACD Family (both naming conventions) ----
//   'MACD_12_26_9': '#00E396', macd: '#00E396',           // Green for MACD line
//   'MACDh_12_26_9': '#775DD0', macd_histogram: '#775DD0', macdh_separate: '#775DD0',  // Purple for MACD histogram  
//   'MACDs_12_26_9': '#FEB019', macd_signal: '#FEB019',   // Orange for MACD signal
  
//   // ---- RSI Family (both naming conventions) ----
//   'RSI_14': '#FF4560', rsi: '#FF4560',         // Red for RSI
//   'RSI_21': '#FF69B4', rsi_fast: '#FF1493', rsi_slow: '#DC143C',
  
//   // ---- Bollinger Bands (all naming conventions) ----
//   'BBL_20_2.0': '#FF4560', 'BBL_20_2': '#FF4560', bb_lower: '#FF4560',     // Red for Lower Band
//   'BBM_20_2.0': '#775DD0', 'BBM_20_2': '#775DD0', bb_middle: '#775DD0',    // Purple for Middle Band  
//   'BBU_20_2.0': '#00E396', 'BBU_20_2': '#00E396', bb_upper: '#00E396',     // Green for Upper Band
//   bb_width: '#FFD700', bb_percent: '#FF69B4',
  
//   // ---- Keltner Channels ----
//   kc_lower: '#FF6347', kc_middle: '#4682B4', kc_upper: '#32CD32',
  
//   // ---- Donchian Channels ----
//   dc_lower: '#8B0000', dc_middle: '#4169E1', dc_upper: '#228B22',
  
//   // ---- ADX Family (both naming conventions) ----
//   'ADX_14': '#775DD0', adx: '#775DD0',         // Purple for ADX
//   'DMP_14': '#00E396', dmp: '#00E396', dm_plus: '#00E396',         // Green for DI+
//   'DMN_14': '#FF4560', dmn: '#FF4560', dm_minus: '#FF4560',        // Red for DI-
  
//   // ---- Stochastic Family (all naming conventions) ----
//   'STOCHk_14_3_3': '#00E396', stoch_k: '#00E396',  // Green for %K
//   'STOCHd_14_3_3': '#FF4560', stoch_d: '#FF4560',  // Red for %D
//   stochrsi_k: '#32CD32', stochrsi_d: '#DC143C',
  
//   // ---- Williams %R ----
//   'WILLR_14': '#FEB019', williams_r: '#FEB019',       // Orange for Williams %R
  
//   // ---- CCI ----
//   'CCI_14': '#775DD0', cci: '#775DD0',         // Purple for CCI
  
//   // ---- ROC & Momentum ----
//   'ROC_10': '#FF69B4', roc: '#FF69B4',         // Pink for ROC
//   mom: '#8A2BE2', momentum_5: '#FF1493', momentum_10: '#DC143C', momentum_20: '#B22222',
  
//   // ---- Volume Indicators ----
//   'OBV': '#00E396', obv: '#00E396',            // Green for On Balance Volume
//   'VOLUME': '#999999', volume: '#999999',      // Gray for Volume
//   ad: '#4682B4', cmf: '#32CD32', volume_roc: '#FF6347',
//   pvt: '#8A2BE2', vwap: '#FFD700', nvi: '#FF1493', pvi: '#DC143C',
//   fi: '#228B22', eom: '#B22222', adosc: '#4169E1', kvo: '#8B008B', vzo: '#FF7F50',
  
//   // ---- Volatility ----
//   atr: '#FF4500', true_range: '#FF6347', natr: '#FF69B4', chaikin_vol: '#8A2BE2',
  
//   // ---- Advanced Oscillators ----
//   mfi: '#9370DB', tsi: '#20B2AA', tsi_signal: '#FF6347', cmo: '#8B4513',
//   stc: '#4682B4', trix: '#32CD32', uo: '#FF1493', ao: '#DC143C',
//   fisher: '#228B22', fisher_signal: '#B22222', rvi: '#4169E1', rvi_signal: '#8B008B',
//   csi: '#FF7F50', wad: '#9370DB', zscore: '#20B2AA', percentrank: '#8B4513',
//   rocp: '#4682B4',
  
//   // ---- Trend Indicators ----
//   psar: '#FF4500', trend_strength: '#32CD32', volatility_rank: '#FF1493', price_position: '#DC143C',
//   linreg: '#228B22', ht_trendline: '#B22222', vortex_pos: '#4169E1', vortex_neg: '#8B008B',
  
//   // ---- Ichimoku ----
//   ichimoku_a: '#FF6B6B', ichimoku_b: '#4ECDC4', ichimoku_base: '#45B7D1',
//   ichimoku_conv: '#96CEB4', ichimoku_span: '#FFEAA7',
  
//   // ---- Aroon ----
//   aroon_up: '#32CD32', aroon_down: '#FF4560', aroon_osc: '#8A2BE2',
  
//   // ---- PPO ----
//   ppo: '#FF7F50', ppo_signal: '#9370DB', ppo_histogram: '#20B2AA',
  
//   // ---- Support/Resistance ----
//   pivot: '#FFD700', r1: '#FF6347', s1: '#32CD32', r2: '#FF1493', s2: '#228B22',
//   fib_support: '#4169E1', fib_resistance: '#8B008B', floor: '#FF7F50', ceiling: '#9370DB',
  
//   // ---- Candlestick Patterns (both naming conventions) ----
//   cdl_doji: '#FEB019', doji: '#FEB019',         // Orange for Doji
//   cdl_hammer: '#00E396', hammer: '#00E396',     // Green for Hammer
//   cdl_engulfing: '#FF4560', engulfing_bullish: '#00E396', engulfing_bearish: '#FF4560',
//   cdl_morning_star: '#00E396', cdl_evening_star: '#FF4560',
//   shooting_star: '#FF4560',
  
//   // ---- Events ----
//   Dividends: '#00E396',        // Green for Dividends
//   'Stock Splits': '#FEB019',   // Orange for Stock Splits
  
//   // ---- Fallback colors for unknown indicators ----
//   default: '#999999',          // Gray for unknown
// };

// // Enhanced helper function to get indicator color
// const getIndicatorColor = (name: string): string => {
//   const lowerName = name.toLowerCase();
  
//   // Check exact match first
//   if (INDICATOR_COLORS[name]) return INDICATOR_COLORS[name];
//   if (INDICATOR_COLORS[lowerName]) return INDICATOR_COLORS[lowerName];
  
//   // Dynamic color assignment for MA patterns
//   const maMatch = lowerName.match(/^(s|e|w|h|t3|tema|dema|zlema|vwma|kama)?ma[_]?(\d+)$/);
//   if (maMatch) {
//     const period = parseInt(maMatch[2]);
//     // Common period colors
//     const periodColors: { [key: number]: string } = {
//       5: '#FFA500', 10: '#FEB019', 20: '#FF4560', 50: '#775DD0',
//       100: '#00E396', 200: '#FF69B4'
//     };
//     return periodColors[period] || '#999999';
//   }
  
//   return INDICATOR_COLORS.default;
// };

// interface DateRange {
//   startDate: string;
//   endDate: string;
// }

// export  function Chart({ defaultSymbol = "AAPL" }:{
//   defaultSymbol?: string;
// }) {
//   /* ───── local state ───────────────────────────────────────────── */
//   const [symbol, setSymbol]   = useState(defaultSymbol);
//   const [search, setSearch]   = useState("");
//   const [frame,  setFrame]    = useState(TF[1]);          // 1-Day default
//   const [series, setSeries]   = useState<any[]>([]);
//   const [loading, setLoad]    = useState(false);
//   const [error,   setError]   = useState("");
//   const [showAnalysis, setShowAnalysis] = useState(false);
//   const [showScreenCapture, setShowScreenCapture] = useState(false);
  
//   // Date range filtering state (OPTIONAL)
//   const [dateRange, setDateRange] = useState<DateRange>({
//     startDate: "",
//     endDate: ""
//   });
//   const [useCustomRange, setUseCustomRange] = useState(false);

//   /* ───── Helper function to format date for API ─────────────────── */
//   const formatDateForAPI = (date: string) => {
//     return new Date(date).toISOString().split('T')[0];
//   };

//   /* ───── fetch whenever symbol, timeframe, or date range changes ── */
//   useEffect(() => {
//     let qs = `${frame.qs}&resolution=${frame.res}` +
//              `&ma=20,50&macd&bb=true&rsi=14&adx&cdl_doji`;   // default indicators

//     // OPTIONAL: Add date range parameters only if custom range is enabled
//     if (useCustomRange && dateRange.startDate && dateRange.endDate) {
//       qs += `&start_date=${formatDateForAPI(dateRange.startDate)}&end_date=${formatDateForAPI(dateRange.endDate)}`;
//     }

//     setLoad(true); setError("");
//     axios
//       .get(`${API}/ohlc/${symbol}/?${qs}`)
//       .then(r => {
//         // Handle both old format (direct array) and new format (with metadata)
//         let seriesData;
//         if (r.data.series) {
//           seriesData = r.data.series;
//         } else {
//           seriesData = r.data;
//         }

//         // Enhance series with proper names and colors using the integrated functions
//         const enhancedSeries = seriesData.map((serie: any, index: number) => ({
//           ...serie,
//           name: formatSeriesName(serie.name || `Series ${index + 1}`),
//           color: getIndicatorColor(serie.name || ''),
//         }));

//         setSeries(enhancedSeries);
//       })
//       .catch((err) => {
//         const errorMsg = err.response?.data?.error || `Could not load ${symbol}`;
//         setError(errorMsg);
//       })
//       .finally(() => setLoad(false));
//   }, [symbol, frame, dateRange, useCustomRange]);

//   /* ───── search box submit ─────────────────────────────────────── */
//   const onSearch = (e: FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) { setSymbol(search.trim().toUpperCase()); setSearch(""); }
//   };

//   /* ───── toggle analysis ─────────────────────────────────────── */
//   const toggleAnalysis = () => {
//     setShowAnalysis(!showAnalysis);
//   };

//   /* ───── toggle screen capture ─────────────────────────────────── */
//   const toggleScreenCapture = () => {
//     setShowScreenCapture(!showScreenCapture);
//   };

//   /* ───── handle date range changes (ONLY when custom range enabled) ── */
//   const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
//     setDateRange(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   /* ───── toggle custom date range ─────────────────────────────── */
//   const toggleCustomRange = () => {
//     setUseCustomRange(!useCustomRange);
//     if (useCustomRange) {
//       // Clear date range when disabling custom range
//       setDateRange({ startDate: "", endDate: "" });
//     }
//   };

//   /* ───── preset date ranges (OPTIONAL convenience) ─────────────── */
//   const setPresetRange = (months: number) => {
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setMonth(startDate.getMonth() - months);
    
//     setDateRange({
//       startDate: startDate.toISOString().split('T')[0],
//       endDate: endDate.toISOString().split('T')[0]
//     });
//     setUseCustomRange(true);
//   };

//   /* ───── render ────────────────────────────────────────────────── */
//   return (
//     <div className="space-y-4">
//       {/* AI Screen Capture Section - Rendered at Top */}
//       {showScreenCapture && (
//         <AIScreenCapture symbol={symbol} />
//       )}
      
//       <div className="bg-white rounded-xl p-6 shadow shadow-slate-200">
//         {/* header */}
//         <div className="flex flex-col gap-4 mb-4">
//           {/* First row: Search and timeframe buttons */}
//           <div className="flex justify-between">
//             <form onSubmit={onSearch} className="flex gap-2">
//               <input value={search} onChange={e=>setSearch(e.target.value)}
//                      placeholder="TSLA"
//                      className="border px-3 py-1 rounded-l w-32" />
//               <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">Search</button>
//             </form>

//             <div className="flex gap-2">
//               {TF.map(t=>(
//                 <button key={t.lbl}
//                   onClick={()=>setFrame(t)}
//                   className={frame.lbl===t.lbl
//                     ? "bg-blue-600 text-white px-3 py-1 rounded"
//                     : "bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"}>
//                   {t.lbl}
//                 </button>
//               ))}
//               <button 
//                 onClick={toggleAnalysis}
//                 className="bg-green-600 text-white px-3 py-1 rounded ml-2 hover:bg-green-700">
//                 {showAnalysis ? "Hide Analysis" : "Show Analysis"}
//               </button>
//               <button 
//                 onClick={toggleScreenCapture}
//                 className="bg-purple-600 text-white px-3 py-1 rounded ml-2 hover:bg-purple-700">
//                 {showScreenCapture ? "Hide AI Capture" : "AI Screen Capture"}
//               </button>
//             </div>
//           </div>

//           {/* OPTIONAL: Date range controls - Only show if user wants them */}
//           <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center gap-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={useCustomRange}
//                   onChange={toggleCustomRange}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium text-sm">📅 Custom Date Range (Optional)</span>
//               </label>
              
//               {/* Preset buttons - Only show when custom range is enabled */}
//               {useCustomRange && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setPresetRange(1)}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
//                     Last Month
//                   </button>
//                   <button
//                     onClick={() => setPresetRange(3)}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
//                     Last 3 Months
//                   </button>
//                   <button
//                     onClick={() => setPresetRange(6)}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
//                     Last 6 Months
//                   </button>
//                   <button
//                     onClick={() => setPresetRange(12)}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
//                     Last Year
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Date inputs - Only show when custom range is enabled */}
//             {useCustomRange && (
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="startDate" className="text-sm font-medium">From:</label>
//                   <input
//                     id="startDate"
//                     type="date"
//                     value={dateRange.startDate}
//                     onChange={e => handleDateRangeChange('startDate', e.target.value)}
//                     className="border px-3 py-1 rounded text-sm"
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="endDate" className="text-sm font-medium">To:</label>
//                   <input
//                     id="endDate"
//                     type="date"
//                     value={dateRange.endDate}
//                     onChange={e => handleDateRangeChange('endDate', e.target.value)}
//                     className="border px-3 py-1 rounded text-sm"
//                   />
//                 </div>
//                 {dateRange.startDate && dateRange.endDate && (
//                   <button
//                     onClick={() => setDateRange({ startDate: "", endDate: "" })}
//                     className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
//                     Clear Dates
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Current range display */}
//             {useCustomRange && dateRange.startDate && dateRange.endDate && (
//               <div className="text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded">
//                 📊 Showing data from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
//               </div>
//             )}
            
//             {/* Helper text when custom range is disabled */}
//             {!useCustomRange && (
//               <div className="text-xs text-gray-500">
//                 💡 Enable custom date range to analyze specific time periods (e.g., May 2024 to June 2024)
//               </div>
//             )}
//           </div>
//         </div>

//         {/* states */}
//         {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200">{error}</div>}
//         {loading && (
//           <div className="h-60 flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-2">Loading…</span>
//           </div>
//         )}

//         {!loading && !error && series.length > 0 && (
//           <div id="stock-chart">
//             <ReactApexChart
//               type="candlestick"
//               height={500}
//               series={series}
//               options={{
//                 chart: { 
//                   toolbar: { show: true },
//                   zoom: { enabled: true },
//                   background: '#ffffff'
//                 },
//                 // Enhanced colors configuration
//                 colors: series.map(s => s.color || '#999999'),
//                 stroke: { 
//                   width: series.map((s, index) => {
//                     // Make candlestick lines thicker, others thinner but visible
//                     if (index === 0) return 2; // Candlestick
//                     if (s.name?.includes('MACD') || s.name?.includes('RSI') || s.name?.includes('ADX')) return 3;
//                     return 2;
//                   }),
//                   curve: 'smooth'
//                 },
//                 // Enhanced legend configuration
//                legend: {
//   show: true,
//   position: 'bottom',
//   horizontalAlign: 'center',
//   floating: false,
//   fontSize: '12px',
//   fontFamily: 'Arial, sans-serif',
//   fontWeight: 600,
//   offsetY: 10,
//   markers: {
//     size: 12,      // Use 'size' for marker size in ApexCharts
//     strokeWidth: 0
//   },
//   itemMargin: {
//     horizontal: 8,
//     vertical: 4
//   },
//   onItemClick: {
//     toggleDataSeries: true
//   },
//   onItemHover: {
//     highlightDataSeries: true
//   }
// },
//                 xaxis: { 
//                   type: "datetime",
//                   labels: {
//                     datetimeFormatter: {
//                       year: 'yyyy',
//                       month: 'MMM \'yy',
//                       day: 'dd MMM',
//                       hour: 'HH:mm'
//                     },
//                     style: {
//                       fontSize: '11px'
//                     }
//                   }
//                 },
//                 yaxis: [
//                   {
//                     seriesName: 'price',
//                     title: {
//                       text: 'Price ($)',
//                       style: {
//                         fontSize: '12px',
//                         fontWeight: 600
//                       }
//                     },
//                     labels: {
//                       style: {
//                         fontSize: '11px'
//                       }
//                     }
//                   }
//                 ],
//                 tooltip: {
//                   x: {
//                     format: 'dd MMM yyyy HH:mm'
//                   },
//                   y: {
//                     formatter: function(value, opts) {
//                       const seriesName = opts?.w?.config?.series?.[opts.seriesIndex]?.name;
//                       if (seriesName?.includes('RSI') || seriesName?.includes('ADX')) {
//                         return value?.toFixed(2);
//                       } else if (seriesName?.includes('MACD')) {
//                         return value?.toFixed(4);
//                       } else if (seriesName?.includes('Price') || seriesName?.includes('MA') || seriesName?.includes('Bollinger')) {
//                         return '$' + value?.toFixed(2);
//                       }
//                       return value?.toString();
//                     }
//                   },
//                   theme: 'light',
//                   style: {
//                     fontSize: '12px'
//                   }
//                 },
//                 title: {
//                   text: `${symbol} Stock Chart with Technical Indicators${useCustomRange && dateRange.startDate && dateRange.endDate ? 
//                     ` (${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()})` : 
//                     ''}`,
//                   align: 'center',
//                   style: {
//                     fontSize: '18px',
//                     fontWeight: 'bold',
//                     color: '#333'
//                   }
//                 },
//                 // Enhanced grid
//                 grid: {
//                   show: true,
//                   borderColor: '#e0e0e0',
//                   strokeDashArray: 1,
//                   position: 'back',
//                   xaxis: {
//                     lines: {
//                       show: true
//                     }
//                   },
//                   yaxis: {
//                     lines: {
//                       show: true
//                     }
//                   }
//                 },
//                 // Add data labels for better AI recognition
//                 dataLabels: {
//                   enabled: false, // Keep disabled to avoid clutter
//                 },
//                 // Enhanced markers for line series
//                 markers: {
//                   size: 0,
//                   strokeWidth: 2,
//                   hover: {
//                     size: 6
//                   }
//                 }
//               }}
//             />
//           </div>
//         )}
        
//         {/* Technical Indicators Summary Box - Helps AI understand what's in the chart */}
//         {!loading && !error && series.length > 0 && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//             <h4 className="font-semibold text-sm mb-2 text-gray-700">📊 Technical Indicators in This Chart:</h4>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
//               {series.map((s, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <div 
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: s.color || '#999999' }}
//                   ></div>
//                   <span className="text-gray-700 font-medium">{s.name}</span>
//                 </div>
//               ))}
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               💡 Each indicator has a unique color and label to help AI analysis identify specific technical patterns and signals.
//             </p>
//           </div>
//         )}
        
//         {/* AI Analysis Section */}
//         {showAnalysis && !loading && !error && (
//           <AIChartAnalysis symbol={symbol} />
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, FormEvent } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import AIChartAnalysis from "./AIChartAnalysis";
import { AIScreenCapture } from "./AIScreenCapture";

const API = "http://localhost:8000/api";

const TF = [
  { lbl: "1H", res: "60", qs: "lookback=48" },
  { lbl: "1D", res: "D",  qs: "lookback=400" },
  { lbl: "1W", res: "W",  qs: "lookback=800" },
  { lbl: "1M", res: "M",  qs: "lookback=2000" },
];

// Enhanced formatSeriesName function
const formatSeriesName = (name: string) => {
  const lowerName = name.toLowerCase();
  
  const nameMap: { [key: string]: string } = {
    // Price
    'price': 'Price',
    
    // Moving Averages
    'sma_5': 'SMA (5)', 'sma_10': 'SMA (10)', 'sma_20': 'SMA (20)', 'sma_50': 'SMA (50)',
    'sma_100': 'SMA (100)', 'sma_200': 'SMA (200)',
    'ema_9': 'EMA (9)', 'ema_12': 'EMA (12)', 'ema_21': 'EMA (21)', 'ema_26': 'EMA (26)',
    'ema_50': 'EMA (50)', 'ema_100': 'EMA (100)', 'ema_200': 'EMA (200)',
    'wma_20': 'WMA (20)', 'hma_20': 'Hull MA (20)', 'vwma_20': 'VWMA (20)',
    
    // MACD
    'macd': 'MACD Line', 'macd_signal': 'MACD Signal', 'macd_histogram': 'MACD Histogram',
    'MACD_12_26_9': 'MACD Line', 'MACDs_12_26_9': 'MACD Signal', 'MACDh_12_26_9': 'MACD Histogram',
    
    // RSI
    'rsi': 'RSI (14)', 'rsi_fast': 'RSI Fast', 'rsi_slow': 'RSI Slow',
    'RSI_14': 'RSI (14)',
    
    // Bollinger Bands
    'bb_lower': 'Bollinger Lower', 'bb_middle': 'Bollinger Middle', 'bb_upper': 'Bollinger Upper',
    'BBL_20_2.0': 'Bollinger Lower', 'BBM_20_2.0': 'Bollinger Middle', 'BBU_20_2.0': 'Bollinger Upper',
    
    // Keltner Channels
    'kc_lower': 'Keltner Lower', 'kc_middle': 'Keltner Middle', 'kc_upper': 'Keltner Upper',
    
    // Donchian Channels
    'dc_lower': 'Donchian Lower', 'dc_middle': 'Donchian Middle', 'dc_upper': 'Donchian Upper',
    
    // ADX
    'adx': 'ADX (14)', 'dmp': 'DI+ (14)', 'dmn': 'DI- (14)',
    'ADX_14': 'ADX (14)', 'DMP_14': 'DI+ (14)', 'DMN_14': 'DI- (14)',
    
    // Stochastic
    'stoch_k': 'Stochastic %K', 'stoch_d': 'Stochastic %D',
    'STOCHk_14_3_3': 'Stochastic %K', 'STOCHd_14_3_3': 'Stochastic %D',
    
    // Other indicators
    'williams_r': 'Williams %R', 'WILLR_14': 'Williams %R',
    'cci': 'CCI (14)', 'CCI_14': 'CCI (14)',
    'mfi': 'Money Flow Index',
    'atr': 'Average True Range',
    'obv': 'On Balance Volume', 'OBV': 'On Balance Volume',
    'psar': 'Parabolic SAR',
    'vwap': 'VWAP',
    'volume': 'Volume',
  };

  // Check exact match
  if (nameMap[name]) return nameMap[name];
  if (nameMap[lowerName]) return nameMap[lowerName];

  // Dynamic pattern matching for MA
  const maMatch = lowerName.match(/^(s|e|w|h)?ma[_]?(\d+)$/);
  if (maMatch) {
    const type = maMatch[1] ? maMatch[1].toUpperCase() + ' ' : '';
    return `${type}MA (${maMatch[2]})`;
  }

  return name;
};

// Indicator colors
const INDICATOR_COLORS: { [key: string]: string } = {
  // Candlestick
  price: '#008FFB',
  
  // Moving Averages
  sma_5: '#FFA500', sma_10: '#FEB019', sma_20: '#FF4560', sma_50: '#775DD0',
  sma_100: '#00E396', sma_200: '#FF69B4',
  ema_9: '#FF6B6B', ema_12: '#4ECDC4', ema_21: '#45B7D1', ema_26: '#96CEB4',
  ema_50: '#FFEAA7', ema_100: '#DDA0DD', ema_200: '#98D8C8',
  wma_20: '#FF7F50', hma_20: '#32CD32', vwma_20: '#8A2BE2',
  
  // MACD
  macd: '#00E396', MACD_12_26_9: '#00E396',
  macd_histogram: '#775DD0', MACDh_12_26_9: '#775DD0',
  macd_signal: '#FEB019', MACDs_12_26_9: '#FEB019',
  
  // RSI
  rsi: '#FF4560', RSI_14: '#FF4560',
  rsi_fast: '#FF1493', rsi_slow: '#DC143C',
  
  // Bollinger Bands
  bb_lower: '#FF4560', BBL_20_2_0: '#FF4560', 'BBL_20_2.0': '#FF4560',
  bb_middle: '#775DD0', BBM_20_2_0: '#775DD0', 'BBM_20_2.0': '#775DD0',
  bb_upper: '#00E396', BBU_20_2_0: '#00E396', 'BBU_20_2.0': '#00E396',
  
  // Keltner Channels
  kc_lower: '#FF6347', kc_middle: '#4682B4', kc_upper: '#32CD32',
  
  // Donchian Channels
  dc_lower: '#8B0000', dc_middle: '#4169E1', dc_upper: '#228B22',
  
  // ADX
  adx: '#775DD0', ADX_14: '#775DD0',
  dmp: '#00E396', DMP_14: '#00E396',
  dmn: '#FF4560', DMN_14: '#FF4560',
  
  // Stochastic
  stoch_k: '#00E396', STOCHk_14_3_3: '#00E396',
  stoch_d: '#FF4560', STOCHd_14_3_3: '#FF4560',
  
  // Other indicators
  williams_r: '#FEB019', WILLR_14: '#FEB019',
  cci: '#775DD0', CCI_14: '#775DD0',
  mfi: '#9370DB',
  atr: '#FF4500',
  obv: '#00E396', OBV: '#00E396',
  psar: '#FF4500',
  vwap: '#FFD700',
  volume: '#999999',
  
  // Default
  default: '#999999',
};

// Helper function to get indicator color
const getIndicatorColor = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  if (INDICATOR_COLORS[name]) return INDICATOR_COLORS[name];
  if (INDICATOR_COLORS[lowerName]) return INDICATOR_COLORS[lowerName];
  
  // Dynamic color for MA patterns
  const maMatch = lowerName.match(/^(s|e|w|h)?ma[_]?(\d+)$/);
  if (maMatch) {
    const period = parseInt(maMatch[2]);
    const periodColors: { [key: number]: string } = {
      5: '#FFA500', 10: '#FEB019', 20: '#FF4560', 50: '#775DD0',
      100: '#00E396', 200: '#FF69B4'
    };
    return periodColors[period] || '#999999';
  }
  
  return INDICATOR_COLORS.default;
};

// Indicator configuration
interface IndicatorConfig {
  id: string;
  name: string;
  category: string;
  params?: string[];
  default: string;
}

const INDICATORS: { [category: string]: IndicatorConfig[] } = {
  "Moving Averages": [
    { id: "sma", name: "Simple Moving Average", category: "moving_averages", params: ["periods"], default: "20,50" },
    { id: "ema", name: "Exponential Moving Average", category: "moving_averages", params: ["periods"], default: "9,21" },
    { id: "wma", name: "Weighted Moving Average", category: "moving_averages", params: ["period"], default: "20" },
    { id: "hma", name: "Hull Moving Average", category: "moving_averages", params: ["period"], default: "20" },
  ],
  "Momentum": [
    { id: "rsi", name: "RSI", category: "momentum", params: ["period"], default: "14" },
    { id: "stoch", name: "Stochastic", category: "momentum", params: ["period"], default: "14" },
    { id: "williams", name: "Williams %R", category: "momentum", params: ["period"], default: "14" },
    { id: "cci", name: "CCI", category: "momentum", params: ["period"], default: "14" },
    { id: "mfi", name: "Money Flow Index", category: "momentum", params: ["period"], default: "14" },
  ],
  "Volatility": [
    { id: "bb", name: "Bollinger Bands", category: "volatility", params: ["period", "std"], default: "true" },
    { id: "kc", name: "Keltner Channels", category: "volatility", params: ["period"], default: "true" },
    { id: "dc", name: "Donchian Channels", category: "volatility", params: ["period"], default: "true" },
    { id: "atr", name: "Average True Range", category: "volatility", params: ["period"], default: "14" },
  ],
  "Trend": [
    { id: "macd", name: "MACD", category: "trend", params: [], default: "true" },
    { id: "adx", name: "ADX", category: "trend", params: ["period"], default: "14" },
    { id: "psar", name: "Parabolic SAR", category: "trend", params: [], default: "true" },
    { id: "ichimoku", name: "Ichimoku Cloud", category: "trend", params: [], default: "true" },
    { id: "aroon", name: "Aroon", category: "trend", params: ["period"], default: "14" },
  ],
  "Volume": [
    { id: "obv", name: "On Balance Volume", category: "volume", params: [], default: "true" },
    { id: "ad", name: "Accumulation/Distribution", category: "volume", params: [], default: "true" },
    { id: "cmf", name: "Chaikin Money Flow", category: "volume", params: ["period"], default: "20" },
    { id: "vwap", name: "VWAP", category: "volume", params: [], default: "true" },
  ],
  "Patterns": [
    { id: "patterns", name: "Candlestick Patterns", category: "patterns", params: [], default: "true" },
  ],
  "Support/Resistance": [
    { id: "pivot", name: "Pivot Points", category: "support_resistance", params: [], default: "true" },
    { id: "fibonacci", name: "Fibonacci Levels", category: "support_resistance", params: [], default: "true" },
  ]
};

interface SelectedIndicator {
  id: string;
  value: string;
  enabled: boolean;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export function Chart({ defaultSymbol = "AAPL" }: { defaultSymbol?: string }) {
  // State management
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [search, setSearch] = useState("");
  const [frame, setFrame] = useState(TF[1]); // 1-Day default
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showScreenCapture, setShowScreenCapture] = useState(false);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  
  // Selected indicators state
  const [selectedIndicators, setSelectedIndicators] = useState<SelectedIndicator[]>([
    { id: "sma", value: "20,50", enabled: true },
    { id: "macd", value: "true", enabled: true },
    { id: "bb", value: "true", enabled: true },
    { id: "rsi", value: "14", enabled: true },
    { id: "adx", value: "14", enabled: true },
  ]);
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: ""
  });
  const [useCustomRange, setUseCustomRange] = useState(false);

  // Build query string from selected indicators
  const buildIndicatorQuery = () => {
    const params: string[] = [];
    selectedIndicators.forEach(indicator => {
      if (indicator.enabled) {
        params.push(`${indicator.id}=${indicator.value}`);
      }
    });
    return params.join('&');
  };

  // Fetch data
  useEffect(() => {
    let qs = `${frame.qs}&resolution=${frame.res}`;
    
    // Add selected indicators
    const indicatorQuery = buildIndicatorQuery();
    if (indicatorQuery) {
      qs += `&${indicatorQuery}`;
    }

    // Add date range if enabled
    if (useCustomRange && dateRange.startDate && dateRange.endDate) {
      qs += `&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`;
    }

    setLoad(true);
    setError("");
    
    axios
      .get(`${API}/ohlc/${symbol}/?${qs}`)
      .then(r => {
        let seriesData = r.data.series || r.data;
        
        // Enhance series with proper names and colors
        const enhancedSeries = seriesData.map((serie: any, index: number) => ({
          ...serie,
          name: formatSeriesName(serie.name || `Series ${index + 1}`),
          color: getIndicatorColor(serie.name || ''),
        }));

        setSeries(enhancedSeries);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || `Could not load ${symbol}`;
        setError(errorMsg);
      })
      .finally(() => setLoad(false));
  }, [symbol, frame, selectedIndicators, dateRange, useCustomRange]);

  // Handle indicator toggle
  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => 
      prev.map(ind => 
        ind.id === indicatorId ? { ...ind, enabled: !ind.enabled } : ind
      )
    );
  };

  // Add new indicator
  const addIndicator = (indicatorId: string, defaultValue: string) => {
    const exists = selectedIndicators.some(ind => ind.id === indicatorId);
    if (!exists) {
      setSelectedIndicators(prev => [...prev, {
        id: indicatorId,
        value: defaultValue,
        enabled: true
      }]);
    }
  };

  // Remove indicator
  const removeIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
  };

  // Update indicator value
  const updateIndicatorValue = (indicatorId: string, value: string) => {
    setSelectedIndicators(prev =>
      prev.map(ind =>
        ind.id === indicatorId ? { ...ind, value } : ind
      )
    );
  };

  // Search submit
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSymbol(search.trim().toUpperCase());
      setSearch("");
    }
  };

  // Toggle panels
  const toggleAnalysis = () => setShowAnalysis(!showAnalysis);
  const toggleScreenCapture = () => setShowScreenCapture(!showScreenCapture);
  const toggleIndicatorPanel = () => setShowIndicatorPanel(!showIndicatorPanel);

  // Date range handlers
  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const toggleCustomRange = () => {
    setUseCustomRange(!useCustomRange);
    if (useCustomRange) {
      setDateRange({ startDate: "", endDate: "" });
    }
  };

  const setPresetRange = (months: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
    setUseCustomRange(true);
  };

  return (
    <div className="space-y-4">
      {/* AI Screen Capture Section */}
      {showScreenCapture && (
        <AIScreenCapture symbol={symbol} />
      )}
      
      <div className="bg-white rounded-xl p-6 shadow shadow-slate-200">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-4">
          {/* First row: Search and controls */}
          <div className="flex justify-between items-center">
            <form onSubmit={onSearch} className="flex gap-2">
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="TSLA"
                className="border px-3 py-1 rounded-l w-32" 
              />
              <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
                Search
              </button>
            </form>

            <div className="flex gap-2">
              {TF.map(t => (
                <button 
                  key={t.lbl}
                  onClick={() => setFrame(t)}
                  className={frame.lbl === t.lbl
                    ? "bg-blue-600 text-white px-3 py-1 rounded"
                    : "bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"}>
                  {t.lbl}
                </button>
              ))}
              
              <button 
                onClick={toggleIndicatorPanel}
                className="bg-purple-600 text-white px-3 py-1 rounded ml-2 hover:bg-purple-700">
                📊 Indicators
              </button>
              
              <button 
                onClick={toggleAnalysis}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                {showAnalysis ? "Hide Analysis" : "AI Analysis"}
              </button>
              
              <button 
                onClick={toggleScreenCapture}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                {showScreenCapture ? "Hide Capture" : "AI Capture"}
              </button>
            </div>
          </div>

          {/* Indicator Selection Panel */}
          {showIndicatorPanel && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm mb-3">Select Technical Indicators</h3>
              
              {/* Selected Indicators */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-600 mb-2">Active Indicators:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIndicators.map(indicator => {
                    const config = Object.values(INDICATORS).flat().find(ind => ind.id === indicator.id);
                    return (
                      <div key={indicator.id} className="bg-white border rounded-lg px-3 py-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={indicator.enabled}
                          onChange={() => toggleIndicator(indicator.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">{config?.name || indicator.id}</span>
                        {config?.params && config.params.length > 0 && (
                          <input
                            type="text"
                            value={indicator.value}
                            onChange={e => updateIndicatorValue(indicator.id, e.target.value)}
                            className="w-20 px-2 py-1 text-xs border rounded"
                            placeholder={config.default}
                          />
                        )}
                        <button
                          onClick={() => removeIndicator(indicator.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Indicators by Category */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(INDICATORS).map(([category, indicators]) => (
                  <div key={category} className="bg-white p-3 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2 text-gray-700">{category}</h4>
                    <div className="space-y-1">
                      {indicators.map(indicator => {
                        const isSelected = selectedIndicators.some(sel => sel.id === indicator.id);
                        return (
                          <button
                            key={indicator.id}
                            onClick={() => !isSelected && addIndicator(indicator.id, indicator.default)}
                            disabled={isSelected}
                            className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                              isSelected 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {isSelected && '✓ '}{indicator.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                💡 Click indicators to add them. Customize parameters in the active indicators section.
              </div>
            </div>
          )}

          {/* Date Range Controls */}
          <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useCustomRange}
                  onChange={toggleCustomRange}
                  className="w-4 h-4"
                />
                <span className="font-medium text-sm">📅 Custom Date Range</span>
              </label>
              
              {useCustomRange && (
                <div className="flex gap-2">
                  <button onClick={() => setPresetRange(1)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    1M
                  </button>
                  <button onClick={() => setPresetRange(3)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    3M
                  </button>
                  <button onClick={() => setPresetRange(6)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    6M
                  </button>
                  <button onClick={() => setPresetRange(12)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    1Y
                  </button>
                </div>
              )}
            </div>

            {useCustomRange && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="startDate" className="text-sm font-medium">From:</label>
                  <input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={e => handleDateRangeChange('startDate', e.target.value)}
                    className="border px-3 py-1 rounded text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="endDate" className="text-sm font-medium">To:</label>
                  <input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={e => handleDateRangeChange('endDate', e.target.value)}
                    className="border px-3 py-1 rounded text-sm"
                  />
                </div>
                {dateRange.startDate && dateRange.endDate && (
                  <button
                    onClick={() => setDateRange({ startDate: "", endDate: "" })}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="h-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading chart data...</span>
          </div>
        )}

        {/* Chart */}
        {!loading && !error && series.length > 0 && (
          <div id="stock-chart">
            <ReactApexChart
              type="line" 
              height={500}
              series={series}
              options={{
                chart: { 
                  type: 'line',
                  toolbar: { show: true },
                  zoom: { enabled: true },
                  background: '#ffffff'
                },
                colors: series.map(s => s.color || '#999999'),
                stroke: { 
                  width: series.map((s, index) => {
                    if (index === 0) return 2; // Candlestick
                    if (s.name?.includes('MACD') || s.name?.includes('RSI') || s.name?.includes('ADX')) return 3;
                    return 2;
                  }),
                  curve: 'smooth'
                },
                legend: {
                  show: true,
                  position: 'bottom',
                  horizontalAlign: 'center',
                  floating: false,
                  fontSize: '12px',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 600,
                  offsetY: 10,
                  markers: {
                    size: 12,
                    strokeWidth: 0
                  },
                  itemMargin: {
                    horizontal: 8,
                    vertical: 4
                  },
                  onItemClick: {
                    toggleDataSeries: true
                  },
                  onItemHover: {
                    highlightDataSeries: true
                  }
                },
                xaxis: { 
                  type: "datetime",
                  labels: {
                    datetimeFormatter: {
                      year: 'yyyy',
                      month: 'MMM \'yy',
                      day: 'dd MMM',
                      hour: 'HH:mm'
                    }
                  }
                },
                yaxis: [{
                  seriesName: 'price',
                  title: { text: 'Price ($)' },
                  labels: { formatter: (val: number) => val.toFixed(2) }
                }],
                tooltip: {
                  x: { format: 'dd MMM yyyy HH:mm' },
                  y: {
                    formatter: function(value, opts) {
                      const seriesName = opts?.w?.config?.series?.[opts.seriesIndex]?.name;
                      if (seriesName?.includes('Price') || seriesName?.includes('MA') || seriesName?.includes('Bollinger')) {
                        return value?.toFixed(2);
                      }
                      return value?.toFixed(2);
                    }
                  }
                },
                title: {
                  text: `${symbol} Chart with Technical Indicators`,
                  align: 'center',
                  style: { fontSize: '18px', fontWeight: 'bold' }
                },
                grid: {
                  show: true,
                  borderColor: '#e0e0e0',
                  strokeDashArray: 1,
                }
              }}
            />
          </div>
        )}
        
        {/* Indicator Summary */}
        {!loading && !error && series.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-sm mb-2 text-gray-700">📊 Active Indicators:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
              {series.map((s, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color || '#999999' }}
                  ></div>
                  <span className="text-gray-700 font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Analysis */}
        {showAnalysis && !loading && !error && (
          <AIChartAnalysis symbol={symbol} />
        )}
      </div>
    </div>
  );
}