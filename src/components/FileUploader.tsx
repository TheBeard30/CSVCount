import React, { useCallback, useState } from 'react'
import { Upload, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { parseFile, validateFileSize, validateFileType } from '@/utils/parser'
import { addFile } from '@/services/storage'
import { UploadedFile } from '@/types'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void
  className?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesChange, className }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null)
    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 验证文件类型
        if (!validateFileType(file)) {
          throw new Error(`文件 "${file.name}" 格式不支持，请上传 CSV 或 Excel 文件`)
        }

        // 验证文件大小
        if (!validateFileSize(file, 5)) {
          throw new Error(`文件 "${file.name}" 超过 5MB 限制`)
        }

        // 解析文件
        const uploadedFile = await parseFile(file)
        
        // 保存到本地存储
        const updatedFiles = addFile(uploadedFile)
        
        // 通知父组件文件列表已更新
        onFilesChange(updatedFiles)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsUploading(false)
    }
  }, [onFilesChange])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // 重置 input 值，允许重复选择同一文件
    e.target.value = ''
  }, [handleFiles])

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            isUploading && 'opacity-50 pointer-events-none'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-guide="file-uploader"
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isUploading ? '正在上传...' : '上传 CSV/Excel 文件'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            拖拽文件到此处，或点击选择文件
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            支持 .csv, .xlsx, .xls 格式，单个文件最大 5MB
          </p>
          
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          
          <Button
            asChild
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
          >
            <label htmlFor="file-upload">
              {isUploading ? '上传中...' : '选择文件'}
            </label>
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FileUploader