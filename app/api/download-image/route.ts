import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBlob = await imageResponse.blob()
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=ai-generated.png'
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
} 