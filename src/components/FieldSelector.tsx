import React, { useState, useMemo } from 'react'
import { Search, CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { UploadedFile } from '@/types'
import { getMergedFields } from '@/utils/stats'

interface FieldSelectorProps {
  fields: string[]
  selectedFields: string[]
  onSelectionChange: (fields: string[]) => void
  className?: string
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selectedFields,
  onSelectionChange,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields
    return fields.filter(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [fields, searchTerm])

  const handleFieldToggle = (field: string) => {
    const newSelectedFields = selectedFields.includes(field)
      ? selectedFields.filter(f => f !== field)
      : [...selectedFields, field]
    onSelectionChange(newSelectedFields)
  }

  const handleSelectAll = () => {
    if (selectedFields.length === filteredFields.length) {
      // 如果当前显示的字段都已选中，则取消选择
      const newSelectedFields = selectedFields.filter(
        field => !filteredFields.includes(field)
      )
      onSelectionChange(newSelectedFields)
    } else {
      // 否则选择所有当前显示的字段
      const newSelectedFields = [...new Set([...selectedFields, ...filteredFields])]
      onSelectionChange(newSelectedFields)
    }
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const isAllSelected = filteredFields.length > 0 && 
    filteredFields.every(field => selectedFields.includes(field))

  if (fields.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">字段选择</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>请先上传文件</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} flex flex-col h-full`} data-guide="field-selector">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            字段选择 ({selectedFields.length}/{fields.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredFields.length === 0}
            >
              {isAllSelected ? '取消全选' : '全选'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={selectedFields.length === 0}
            >
              清空
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* 搜索框 */}
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索字段..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {/* 字段列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {filteredFields.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {searchTerm ? '未找到匹配的字段' : '暂无可用字段'}
            </div>
          ) : (
            filteredFields.map((field) => (
              <div
                key={field}
                className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                onClick={() => handleFieldToggle(field)}
              >
                <Checkbox
                  checked={selectedFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                />
                <label className="text-sm font-medium cursor-pointer flex-1">
                  {field}
                </label>
              </div>
            ))
          )}
        </div>

        {selectedFields.length > 0 && (
          <div className="mt-4 pt-4 border-t flex-shrink-0">
            <p className="text-sm text-muted-foreground mb-2">
              已选择 {selectedFields.length} 个字段：
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedFields.map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                >
                  {field}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFieldToggle(field)
                    }}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FieldSelector