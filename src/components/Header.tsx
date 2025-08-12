import React from 'react'
import { FileText } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const Header: React.FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CSV 数据统计工具</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header