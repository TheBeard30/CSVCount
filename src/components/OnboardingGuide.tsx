import React, { useState, useEffect } from 'react'
import { X, Upload, List, CheckSquare, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingGuideProps {
  isVisible: boolean
  onClose: () => void
  currentStep?: number
}

const steps = [
  {
    id: 1,
    title: '上传 CSV 文件',
    description: '点击上传区域或拖拽文件到此处，支持多个 CSV 文件同时上传',
    icon: Upload,
    target: '[data-guide="file-uploader"]'
  },
  {
    id: 2,
    title: '查看上传文件列表',
    description: '点击右下角的文件图标查看已上传的文件列表，可以管理和删除文件',
    icon: List,
    target: '[data-guide="file-list"]'
  },
  {
    id: 3,
    title: '选择统计字段',
    description: '在左侧面板中勾选需要统计的字段，支持多选',
    icon: CheckSquare,
    target: '[data-guide="field-selector"]'
  },
  {
    id: 4,
    title: '查看统计结果',
    description: '在右侧面板查看生成的统计数据，包括表格和图表展示',
    icon: BarChart3,
    target: '[data-guide="stats-table"]'
  }
]

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ 
  isVisible, 
  onClose, 
  currentStep = 1 
}) => {
  const [activeStep, setActiveStep] = useState(currentStep)
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!isVisible) {
      setHighlightElement(null)
      return
    }

    const step = steps.find(s => s.id === activeStep)
    if (step) {
      // 延迟查找元素，确保 DOM 已更新
      const timer = setTimeout(() => {
        const element = document.querySelector(step.target) as HTMLElement
        if (element) {
          setHighlightElement(element)
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, activeStep])

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isVisible) return null

  const currentStepData = steps.find(s => s.id === activeStep)
  if (!currentStepData) return null

  const IconComponent = currentStepData.icon

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* 高亮元素 */}
      {highlightElement && (() => {
        const rect = highlightElement.getBoundingClientRect()
        return (
          <div 
            className="fixed z-50 pointer-events-none"
            style={{
              left: rect.left - 4,
              top: rect.top - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              border: '3px solid #3b82f6',
              borderRadius: '8px',
              boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3)'
            }}
          />
        )
      })()}
      
      {/* 引导卡片 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* 步骤指示器 */}
          <div className="flex items-center space-x-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === activeStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step.id < activeStep 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    step.id < activeStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* 描述 */}
          <p className="text-muted-foreground mb-6">
            {currentStepData.description}
          </p>
          
          {/* 底部按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {activeStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一步</span>
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
              >
                跳过引导
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                className="flex items-center space-x-1"
              >
                <span>{activeStep === steps.length ? '完成' : '下一步'}</span>
                {activeStep < steps.length && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingGuide