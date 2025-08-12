import React, { useState, useEffect } from 'react'
import { FileText, BarChart3 } from 'lucide-react'
import Header from '@/components/Header'
import OnboardingGuide from '@/components/OnboardingGuide'
import FileUploader from '@/components/FileUploader'
import FloatingFileList from '@/components/FloatingFileList'
import FieldSelector from '@/components/FieldSelector'
import { StatsTable } from '@/components/StatsTable'
import ExportButton from '@/components/ExportButton'
import { useOnboarding } from '@/hooks/useOnboarding'
import { UploadedFile, StatsReport } from '@/types'
import { generateStatsReport, getMergedFields } from '@/utils/stats'
import { getAllFiles, getLastReport } from '@/services/storage'

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [statsReport, setStatsReport] = useState<StatsReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // 引导功能
  const { isOnboardingVisible, currentStep, closeOnboarding, showOnboarding } = useOnboarding(
    files, 
    selectedFields, 
    statsReport
  )

  // 加载本地存储的数据
  useEffect(() => {
    const loadData = () => {
      const storedFiles = getAllFiles()
      const lastReport = getLastReport()
      
      setFiles(storedFiles)
      if (lastReport) {
        setStatsReport(lastReport)
        setSelectedFields(lastReport.selectedFields)
      }
    }

    loadData()
  }, [])

  // 当文件或选择的字段变化时，生成统计报告
  useEffect(() => {
    const generateReport = async () => {
      if (files.length === 0 || selectedFields.length === 0) {
        setStatsReport(null)
        return
      }

      setIsGenerating(true)
      try {
        const report = await generateStatsReport(files, selectedFields)
        setStatsReport(report)
      } catch (error) {
        console.error('生成统计报告失败:', error)
        setStatsReport(null)
      } finally {
        setIsGenerating(false)
      }
    }

    generateReport()
  }, [files, selectedFields])

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    // 如果没有文件了，清空选择的字段
    if (newFiles.length === 0) {
      setSelectedFields([])
    }
  }

  const availableFields = getMergedFields(files)

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header onShowOnboarding={showOnboarding} />
      
      {/* 引导组件 */}
      <OnboardingGuide 
        isVisible={isOnboardingVisible} 
        onClose={closeOnboarding}
        currentStep={currentStep}
      />
      
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Left Panel */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex-shrink-0">
            <FileUploader onFilesChange={handleFilesChange} />
          </div>
          
          {availableFields.length > 0 && (
            <div className="flex-1 min-h-0">
              <FieldSelector
                fields={availableFields}
                selectedFields={selectedFields}
                onSelectionChange={setSelectedFields}
              />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col gap-4">
          {statsReport && (
            <div className="flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-medium">统计结果</span>
                {isGenerating && (
                  <span className="text-sm text-muted-foreground">生成中...</span>
                )}
              </div>
              <ExportButton report={statsReport} disabled={isGenerating} />
            </div>
          )}
          
          <div className="flex-1 min-h-0">
            <StatsTable report={statsReport} className="h-full" />
          </div>
        </div>
        
        {/* 浮动文件列表 */}
        <FloatingFileList files={files} onFilesChange={handleFilesChange} />
      </div>
    </div>
  )
}

export default App