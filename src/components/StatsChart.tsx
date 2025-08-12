import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { StatsReport } from '@/types'

interface StatsChartProps {
  report: StatsReport | null
  activeField: string | null
}

type ChartType = 'bar' | 'pie'

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
]

export const StatsChart: React.FC<StatsChartProps> = ({ report, activeField }) => {
  const [chartType, setChartType] = useState<ChartType>('bar')

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

  // 显示所有数据
  const chartData = activeFieldStat.values.map((item, index) => ({
    name: item.value === null ? 'null' : String(item.value),
    value: item.count,
    fill: COLORS[index % COLORS.length]
  }))

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
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
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              柱状图
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              饼图
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>总数: {activeFieldStat.totalCount}</span>
            <span>去重: {activeFieldStat.uniqueCount}</span>
            <span>显示前 {Math.min(10, activeFieldStat.values.length)} 项</span>
          </div>
        </div>
        {chartType === 'bar' ? renderBarChart() : renderPieChart()}
      </CardContent>
    </Card>
  )
}