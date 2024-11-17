'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight, Wand2, Sparkles, icons } from 'lucide-react'
import { generateImage, optimizePrompt } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const Github = icons.Github

export function AiImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('default')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [animatedBackground, setAnimatedBackground] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBackground(prev => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
    <div 
      className={`flex h-screen w-screen overflow-hidden relative 
        transition-all duration-1000 ease-in-out
        ${animatedBackground 
          ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 animate-gradient-x' 
          : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}
    >
      {/* 可收缩的左侧设置面板 */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white/90 backdrop-blur-sm border-r shadow-xl rounded-r-2xl 
          transition-all duration-300 ease-in-out overflow-y-auto relative flex flex-col
          ${isSettingsPanelCollapsed ? 'w-16 items-center' : 'w-1/3'}`}
      >
        {/* 收缩/展开按钮 */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 hover:bg-purple-100 transition-colors"
          onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
        >
          {isSettingsPanelCollapsed ? <ChevronRight className="text-purple-600" /> : <ChevronLeft className="text-purple-600" />}
        </Button>

        {/* 收缩状态下的最小化内容 */}
        {isSettingsPanelCollapsed && (
          <div className="flex flex-col items-center mt-16 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                ${isOptimizing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-200 active:bg-purple-300'}
                bg-purple-100 p-2 rounded-full transition-colors
              `}
              onClick={!isOptimizing ? handleOptimizePrompt : undefined}
            >
              {isOptimizing ? (
                <Loader2 className="text-purple-600 animate-spin" size={24} />
              ) : (
                <Wand2 className="text-purple-600" size={24} />
              )}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-pink-100 p-2 rounded-full cursor-pointer hover:bg-pink-200 active:bg-pink-300 transition-colors"
              onClick={() => setIsSettingsPanelCollapsed(false)}
            >
              <Sparkles className="text-pink-600" size={24} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-100 p-2 rounded-full cursor-pointer hover:bg-blue-200 active:bg-blue-300 transition-colors"
              onClick={handleDownload}
            >
              <Download className="text-blue-600" size={24} />
            </motion.div>
          </div>
        )}

        {/* 设置内容 */}
        {!isSettingsPanelCollapsed && (
          <div className="p-6 space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
            >
              AI Image Generator
            </motion.h1>
            
            {/* Prompt 区域 */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="flex items-center">
                <Sparkles className="mr-2 text-purple-500" size={16} />
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] focus:ring-2 focus:ring-purple-300 transition-all"
              />
              <Button 
                onClick={handleOptimizePrompt}
                variant="outline"
                className="w-full group hover:bg-purple-50 transition-colors"
                disabled={isOptimizing || !prompt.trim()}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform text-purple-600" />
                    Optimize Prompt
                  </>
                )}
              </Button>
            </div>

            {/* 模型选择 */}
            <div className="space-y-2">
              <Label htmlFor="model" className="flex items-center">
                <Sparkles className="mr-2 text-pink-500" size={16} />
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger 
                  id="model" 
                  className="hover:border-purple-300 focus:border-purple-500 transition-colors"
                >
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">flux-1-schnell</SelectItem>
                  <SelectItem value="artistic" disabled>Artistic</SelectItem>
                  <SelectItem value="photorealistic" disabled>Photorealistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 生成按钮 */}
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                          transition-all duration-300 transform hover:scale-105 active:scale-95"
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
      </motion.div>

      {/* 图像展示区域 */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-grow bg-white/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center 
        transition-all duration-300 ease-in-out overflow-auto rounded-l-2xl shadow-xl
        ${isSettingsPanelCollapsed ? 'w-full' : 'w-2/3'}`}
      >
        <AnimatePresence>
          {generatedImage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-full max-h-full"
            >
              <Image
                src={generatedImage}
                alt="Generated image"
                width={512}
                height={512}
                className={`rounded-lg shadow-2xl transition-all duration-300 object-contain 
                  ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'} 
                  hover:shadow-purple-300/50`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <div className="absolute top-2 right-2 space-x-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="hover:bg-purple-100 transition-colors"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {isZoomed ? (
                    <Minimize2 className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-purple-600" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="hover:bg-purple-100 transition-colors"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500"
            >
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-16 w-16 animate-spin mb-4 text-purple-600" />
                  <p>Creating your masterpiece...</p>
                </div>
              ) : (
                <p>Your generated image will appear here</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 底部版权和 GitHub 链接 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-0 right-0 flex justify-center items-center text-gray-500 text-sm"
      >
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
          <span>© 2024 AI Image Generator</span>
          <Link 
            href="https://github.com/1137882300/cf-ai-pic" 
            target="_blank" 
            className="hover:text-purple-700 transition-colors group"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}