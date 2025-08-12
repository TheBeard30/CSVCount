import React from 'react'
import { FileText, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'

interface HeaderProps {
  onShowOnboarding?: () => void
}

const Header: React.FC<HeaderProps> = ({ onShowOnboarding }) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CSV 数据统计工具</h1>
        </div>
        <div className="flex items-center space-x-2">
          {onShowOnboarding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowOnboarding}
              className="flex items-center space-x-1"
            >
              <HelpCircle className="h-4 w-4" />
              <span>使用帮助</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header