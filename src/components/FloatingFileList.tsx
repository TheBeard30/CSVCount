import React, { useState } from 'react'
import { Files, Trash2, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadedFile } from '@/types'
import { formatFileSize } from '@/lib/utils'
import { removeFile, clearAllFiles } from '@/services/storage'

interface FloatingFileListProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

const FloatingFileList: React.FC<FloatingFileListProps> = ({ files, onFilesChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = (fileId: string) => {
    const updatedFiles = removeFile(fileId)
    onFilesChange(updatedFiles)
  }

  const handleClearAll = () => {
    const updatedFiles = clearAllFiles()
    onFilesChange(updatedFiles)
    setIsOpen(false)
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

  return (
    <>
      {/* 浮动按钮 */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        data-guide="file-list"
      >
        <Files className="h-6 w-6" />
        {files.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {files.length}
          </span>
        )}
      </Button>

      {/* 浮动文件列表 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">已上传文件 ({files.length})</CardTitle>
                <div className="flex items-center gap-2">
                  {files.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      全部删除
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>暂无上传文件</p>
                </div>
              ) : (
                <div className="h-full space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{getNonEmptyRowCount(file.data)} 行数据</span>
                            <span>{file.fields.length} 个字段</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="删除文件"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default FloatingFileList