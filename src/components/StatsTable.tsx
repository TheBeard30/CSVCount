import React, { useState, useEffect } from 'react'
import { BarChart3, Table as TableIcon, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatsReport } from '@/types'
import { Button } from './ui/button'
import { StatsChart } from './StatsChart'

interface StatsTableProps {
  report: StatsReport | null
  className?: string
}

type ViewMode = 'table' | 'chart'

export const StatsTable: React.FC<StatsTableProps> = ({ report, className }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  useEffect(() => {
    if (report && report.fieldStats.length > 0) {
      setActiveTab(report.fieldStats[0].fieldName)
    } else {
      setActiveTab(null)
    }
  }, [report])

  if (!report || report.fieldStats.length === 0) {
    return (
      <Card className={className} data-guide="stats-table">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>统计结果</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>请选择字段进行统计</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeFieldStat = report.fieldStats.find(
    (stat) => stat.fieldName === activeTab
  )

  return (
    <Card className={`${className} flex flex-col`} data-guide="stats-table">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">统计结果</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-shrink-0 px-4 pt-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              {report.fieldStats.map((fieldStat) => (
                <Button
                  key={fieldStat.fieldName}
                  variant={activeTab === fieldStat.fieldName ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(fieldStat.fieldName)}
                  className="rounded-t-md"
                >
                  {fieldStat.fieldName}
                </Button>
              ))}
            </div>
            <div className="flex space-x-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4 mr-1" />
                表格
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                图表
              </Button>
            </div>
          </div>
        </div>

        {activeFieldStat && viewMode === 'table' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>总数: {activeFieldStat.totalCount}</span>
              <span>去重: {activeFieldStat.uniqueCount}</span>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/3">字段值</TableHead>
                    <TableHead className="w-1/3 text-right">出现次数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {activeFieldStat.values.map((valueCount, index) => (
                     <TableRow key={`${activeFieldStat.fieldName}-${index}`}>
                       <TableCell className="font-medium">
                         {valueCount.value === null ? (
                           <span className="text-muted-foreground italic">
                             null
                           </span>
                         ) : (
                           String(valueCount.value)
                         )}
                       </TableCell>
                       <TableCell className="text-right">
                         {valueCount.count.toLocaleString()}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
              </Table>
            </div>
            { (
              <p className="text-sm text-muted-foreground text-center">
                共 {activeFieldStat.values.length} 个不同值
              </p>
            )}
          </div>
        )}
        
        {viewMode === 'chart' && (
          <div className="flex-1 overflow-hidden p-4">
            <StatsChart report={report} activeField={activeTab} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}