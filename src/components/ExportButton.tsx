import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsReport } from '@/types'
import { exportToCSV, downloadFile } from '@/utils/stats'

interface ExportButtonProps {
  report: StatsReport | null
  disabled?: boolean
  className?: string
}

const ExportButton: React.FC<ExportButtonProps> = ({ report, disabled, className }) => {
  const handleExport = () => {
    if (!report) return

    try {
      const csvContent = exportToCSV(report)
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `统计报告_${timestamp}.csv`
      
      downloadFile(csvContent, filename, 'text/csv')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  const isDisabled = disabled || !report || report.fieldStats.length === 0

  return (
    <Button
      onClick={handleExport}
      disabled={isDisabled}
      className={className}
      variant="outline"
    >
      <Download className="h-4 w-4 mr-2" />
      导出 CSV
    </Button>
  )
}

export default ExportButton