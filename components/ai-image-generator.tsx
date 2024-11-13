'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Maximize2, Minimize2 } from 'lucide-react'
import { generateImage, optimizePrompt } from '@/lib/api'
import Image from 'next/image'

export function AiImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('default')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [showModels, setShowModels] = useState(true)
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

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `ai-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Controls */}
          <div className="md:w-1/2 p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>
            
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
              <div className="flex justify-between items-center">
                <Label htmlFor="model">Model</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModels(!showModels)}
                >
                  {showModels ? 'Hide Models' : 'Show Models'}
                </Button>
              </div>
              
              {showModels && (
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
              )}
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

          {/* Right side - Generated Image */}
          <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-gray-50">
            {generatedImage ? (
              <div className="relative">
                <Image
                  src={generatedImage}
                  alt="Generated image"
                  width={512}
                  height={512}
                  className={`rounded-lg shadow-md transition-all duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
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
        </div>
      </div>
    </div>
  )
}