import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received data from Figma plugin:', data);
    
    // 여기서 받은 데이터를 처리할 수 있습니다
    // 예: 데이터베이스 저장, 파일 생성, 다른 서비스 호출 등
    
    return NextResponse.json({
      success: true,
      message: 'Data received successfully',
      receivedData: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing Figma data:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Figma API endpoint is working',
    endpoints: {
      POST: '/api/figma - Receive data from Figma plugin',
      GET: '/api/figma - API status'
    }
  });
} 