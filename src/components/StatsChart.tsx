import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, LineChart, Line, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react'
import { StatsReport } from '@/types'

interface StatsChartProps {
  report: StatsReport | null
  activeField: string | null
}

type ChartType = 'bar' | 'treemap' | 'line'

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
]

const ITEMS_PER_PAGE = 20

export const StatsChart: React.FC<StatsChartProps> = ({ report, activeField }) => {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [currentPage, setCurrentPage] = useState(0)

  if (!report || !activeField) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>数据图表</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>请选择字段查看图表</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeFieldStat = report.fieldStats.find(
    (stat) => stat.fieldName === activeField
  )

  if (!activeFieldStat) {
    return null
  }

  // 分页处理数据
  const totalItems = activeFieldStat.values.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
  
  const paginatedData = activeFieldStat.values.slice(startIndex, endIndex)
  const chartData = paginatedData.map((item, index) => ({
    name: item.value === null ? 'null' : String(item.value),
    value: item.count,
    fill: COLORS[index % COLORS.length]
  }))

  // 重置页码当切换图表类型时
  React.useEffect(() => {
    setCurrentPage(0)
  }, [chartType])

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#8884d8" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="value" 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderTreemap = () => {
    const treemapData = chartData.map((item, index) => ({
      name: item.name,
      size: item.value,
      fill: COLORS[index % COLORS.length]
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4/3}
          stroke="#fff"
          fill="#8884d8"
        />
      </ResponsiveContainer>
    )
  }

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#82ca9d" 
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>数据图表 - {activeField}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              柱状图
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              线图
            </Button>
            <Button
              variant={chartType === 'treemap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('treemap')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              树状图
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>总数: {activeFieldStat.totalCount}</span>
            <span>去重: {activeFieldStat.uniqueCount}</span>
            <span>显示 {startIndex + 1}-{endIndex} 项，共 {totalItems} 项数据</span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {currentPage + 1} 页，共 {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'line' && renderLineChart()}
        {chartType === 'treemap' && renderTreemap()}
      </CardContent>
    </Card>
  )
}