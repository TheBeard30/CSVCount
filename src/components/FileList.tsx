import React from 'react'
import { Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadedFile } from '@/types'
import { formatFileSize, formatDateTime } from '@/lib/utils'
import { removeFile } from '@/services/storage'

interface FileListProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  className?: string
}

const FileList: React.FC<FileListProps> = ({ files, onFilesChange, className }) => {
  const handleDelete = (fileId: string) => {
    const updatedFiles = removeFile(fileId)
    onFilesChange(updatedFiles)
  }

  const getNonEmptyRowCount = (data: any[]) => {
    return data.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false
        if (typeof value === 'string' && value.trim() === '') return false
        return true
      })
    }).length
  }

  if (files.length === 0) {
    return (
      <Card className={`${className} flex flex-col`}>
        <CardHeader>
          <CardTitle className="text-lg">已上传文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>暂无上传文件</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} flex flex-col`}>
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">已上传文件 ({files.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="h-full space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{getNonEmptyRowCount(file.data)} 行</span>
                    <span>{file.fields.length} 字段</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
                className="text-muted-foreground hover:text-destructive h-6 w-6"
                title="删除文件"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default FileList