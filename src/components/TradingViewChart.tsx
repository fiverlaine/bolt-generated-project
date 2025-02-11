import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface Props {
  symbol: string;
  interval: number;
}

const TradingViewChart: React.FC<Props> = ({ symbol, interval }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          container_id: container.current.id,
          width: '100%',
          height: '600',
          symbol: `BINANCE:${symbol}`,
          interval: interval.toString(),
          timezone: 'America/Sao_Paulo',
          theme: 'dark',
          style: '1',
          locale: 'br',
          toolbar_bg: '#1a1a1a',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'MAExp@tv-basicstudies'
          ],
          container: container.current,
          loading_screen: { backgroundColor: "#131722" },
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#26a69a",
            "mainSeriesProperties.candleStyle.downColor": "#ef5350",
            "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350"
          },
          studies_overrides: {
            "RSI.upperLimit": 70,
            "RSI.lowerLimit": 30,
            "RSI.plotType": "line_with_breaks",
            "MACD.fastLength": 12,
            "MACD.slowLength": 26,
            "MACD.signalLength": 9
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol, interval]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
      <div 
        id="tradingview_chart" 
        ref={container} 
        className="w-full h-[600px]"
      />
    </div>
  );
};

export default TradingViewChart;
