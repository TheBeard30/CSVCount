import { UploadedFile, FieldStats, ValueCount, StatsReport } from '@/types'

/**
 * 计算字段统计信息
 */
export const calculateFieldStats = (
  files: UploadedFile[],
  selectedFields: string[]
): FieldStats[] => {
  const fieldStatsMap = new Map<string, Map<string, number>>()

  // 初始化字段统计映射
  selectedFields.forEach(field => {
    fieldStatsMap.set(field, new Map())
  })

  // 统计每个字段的值出现次数（过滤空值）
  files.forEach(file => {
    file.data.forEach(row => {
      selectedFields.forEach(field => {
        if (field in row) {
          const value = row[field]
          // 过滤空值：null、undefined、空字符串、纯空格字符串
          if (value !== null && value !== undefined && value !== '' && 
              (typeof value !== 'string' || value.trim() !== '')) {
            const normalizedValue = String(value)
            const fieldMap = fieldStatsMap.get(field)!
            fieldMap.set(normalizedValue, (fieldMap.get(normalizedValue) || 0) + 1)
          }
        }
      })
    })
  })

  // 转换为 FieldStats 格式
  const fieldStats: FieldStats[] = []
  selectedFields.forEach(fieldName => {
    const valueMap = fieldStatsMap.get(fieldName)!
    const totalCount = Array.from(valueMap.values()).reduce((sum, count) => sum + count, 0)
    const uniqueCount = valueMap.size

    const values: ValueCount[] = Array.from(valueMap.entries())
      .map(([value, count]) => ({
        value: value === 'null' ? null : value,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count) // 按出现次数降序排列

    fieldStats.push({
      fieldName,
      totalCount,
      uniqueCount,
      values,
    })
  })

  return fieldStats
}

/**
 * 生成统计报告
 */
export const generateStatsReport = (
  files: UploadedFile[],
  selectedFields: string[]
): StatsReport => {
  const fieldStats = calculateFieldStats(files, selectedFields)
  
  // 计算有效行数（排除所有字段都为空的行）
  const totalRows = files.reduce((sum, file) => {
    const validRows = file.data.filter(row => {
      // 检查行中是否至少有一个字段有有效值
      return Object.values(row).some(value => {
        return value !== null && value !== undefined && value !== '' && 
               (typeof value !== 'string' || value.trim() !== '')
      })
    })
    return sum + validRows.length
  }, 0)

  return {
    selectedFields,
    fieldStats,
    totalRows,
    generatedAt: new Date(),
  }
}

/**
 * 获取所有文件的合并字段列表
 */
export const getMergedFields = (files: UploadedFile[]): string[] => {
  const fieldsSet = new Set<string>()
  files.forEach(file => {
    file.fields.forEach(field => fieldsSet.add(field))
  })
  return Array.from(fieldsSet).sort()
}

/**
 * 导出统计数据为 CSV 格式
 */
export const exportToCSV = (report: StatsReport): string => {
  const headers = ['字段名', '字段值', '出现次数', '百分比']
  const rows = [headers.join(',')]

  report.fieldStats.forEach(fieldStat => {
    fieldStat.values.forEach(valueCount => {
      const row = [
        `"${fieldStat.fieldName}"`,
        `"${valueCount.value || ''}"`,
        valueCount.count.toString(),
        valueCount.percentage.toFixed(2) + '%',
      ]
      rows.push(row.join(','))
    })
  })

  // 添加汇总信息
  rows.push('')
  rows.push('汇总信息')
  rows.push(`总行数,${report.totalRows}`)
  rows.push(`选择字段数,${report.selectedFields.length}`)
  rows.push(`生成时间,"${report.generatedAt.toLocaleString('zh-CN')}"`)

  return rows.join('\n')
}

/**
 * 下载文件
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/csv'): void => {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}