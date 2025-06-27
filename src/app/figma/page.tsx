'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FigmaData {
  id: string;
  name: string;
  type: string;
  properties: Record<string, unknown>;
  image?: string;
  timestamp?: string;
}

export default function FigmaIntegrationPage() {
  const [figmaData, setFigmaData] = useState<FigmaData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Figma 플러그인으로부터 데이터 수신을 위한 postMessage 리스너
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 보안을 위해 origin 체크 (개발 시에는 주석 처리)
      // if (event.origin !== 'https://www.figma.com') return;
      
      console.log('Received message from Figma:', event.data);
      
      if (event.data.type === 'figma-export-data') {
        setFigmaData(prev => [...prev, ...event.data.data]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const clearData = () => {
    setFigmaData([]);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(figmaData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `figma-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const testAPIConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/figma');
      const data = await response.json();
      console.log('API Test Result:', data);
      alert('API 연결 성공! 콘솔을 확인하세요.');
    } catch (error) {
      console.error('API Test Error:', error);
      alert('API 연결 실패!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Figma Integration
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Figma 플러그인에서 전송된 디자인 데이터를 확인하고 관리하세요
          </p>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={testAPIConnection}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? '테스트 중...' : '🔗 API 연결 테스트'}
            </button>
            
            <button
              onClick={exportToJSON}
              disabled={figmaData.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              📁 JSON으로 내보내기
            </button>
            
            <button
              onClick={clearData}
              disabled={figmaData.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              🗑️ 데이터 지우기
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 사용 방법</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">1. Figma 플러그인 설치</h3>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Figma에서 Plugins → Development → Import plugin from manifest 선택</li>
                <li>프로젝트의 <code className="bg-gray-100 px-1 rounded">figma-plugin/manifest.json</code> 파일 선택</li>
                <li>플러그인이 로드되면 사용 준비 완료!</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">2. 데이터 전송하기</h3>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Figma에서 원하는 요소들을 선택</li>
                <li>플러그인에서 &ldquo;프론트엔드로 내보내기&rdquo; 클릭</li>
                <li>이 페이지에서 실시간으로 데이터 확인</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📦 수신된 데이터 ({figmaData.length}개)
            </h2>
            {figmaData.length > 0 && (
              <span className="text-sm text-gray-500">
                마지막 업데이트: {new Date().toLocaleTimeString()}
              </span>
            )}
          </div>

          {figmaData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500 mb-4">
                아직 받은 데이터가 없습니다
              </p>
              <p className="text-gray-400">
                Figma 플러그인에서 데이터를 전송해보세요!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {figmaData.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">ID: {item.id}</span>
                  </div>

                  {item.image && (
                    <div className="mb-4">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={800}
                        height={400}
                        className="max-w-full h-auto max-h-64 rounded-lg border"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">속성:</h4>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(item.properties, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>💡 팁: 브라우저 개발자 도구 콘솔에서 더 자세한 로그를 확인할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
} 