'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight, icons } from 'lucide-react'
import { generateImage, optimizePrompt } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'

const Github = icons.Github

export function AiImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('default')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true)
    try {
      const imageUrl = await generateImage(prompt, model)
      setGeneratedImage(imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      // 使用 Next.js API 路由作为代理下载
      const response = await fetch(`/api/download-image?url=${encodeURIComponent(generatedImage)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ai-generated-${Date.now()}.png`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      // 可以添加用户友好的错误提示
    }
  }

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsOptimizing(true)
    try {
      const optimizedPrompt = await optimizePrompt(prompt)
      setPrompt(optimizedPrompt)
    } catch (error) {
      console.error('Error optimizing prompt:', error)
      // 可以添加错误提示
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* 可收缩的左侧设置面板 */}
      <div 
        className={`bg-white border-r transition-all duration-300 ease-in-out overflow-y-auto relative
          ${isSettingsPanelCollapsed ? 'w-16' : 'w-1/3'}`}
      >
        {/* 收缩/展开按钮 - 现在位于左侧面板的右上角 */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10"
          onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
        >
          {isSettingsPanelCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        {/* 设置内容 */}
        {!isSettingsPanelCollapsed && (
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>
            
            {/* Prompt 和其他设置保持不变 */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleOptimizePrompt}
                variant="outline"
                className="w-full"
                disabled={isOptimizing || !prompt.trim()}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  'Optimize Prompt'
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">flux-1-schnell</SelectItem>
                  <SelectItem value="artistic" disabled>Artistic</SelectItem>
                  <SelectItem value="photorealistic" disabled>Photorealistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 图像展示区域 */}
      <div 
        className={`flex-grow bg-gray-50 p-6 flex flex-col items-center justify-center 
        transition-all duration-300 ease-in-out overflow-auto
        ${isSettingsPanelCollapsed ? 'w-full' : 'w-2/3'}`}
      >
        {generatedImage ? (
          <div className="relative max-w-full max-h-full">
            <Image
              src={generatedImage}
              alt="Generated image"
              width={512}
              height={512}
              className={`rounded-lg shadow-md transition-all duration-300 object-contain 
                ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            <div className="absolute top-2 right-2 space-x-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {isZoomed ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 animate-spin mb-4" />
                <p>Creating your masterpiece...</p>
              </div>
            ) : (
              <p>Your generated image will appear here</p>
            )}
          </div>
        )}
      </div>

      {/* 底部版权和 GitHub 链接 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <span>© 2024 AI Image Generator</span>
          <Link 
            href="https://github.com/1137882300/cf-ai-pic" 
            target="_blank" 
            className="hover:text-gray-700 transition-colors"
          >
            <Github size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}