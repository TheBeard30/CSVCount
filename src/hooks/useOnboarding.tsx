import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'csv-count-onboarding-completed'

export const useOnboarding = (files?: any[], selectedFields?: string[], statsReport?: any) => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    // 检查用户是否已经完成过引导
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY)
    
    if (!hasCompletedOnboarding) {
      // 延迟显示引导，让页面先加载完成
      const timer = setTimeout(() => {
        setIsOnboardingVisible(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  // 智能步骤检测
  useEffect(() => {
    if (!isOnboardingVisible) return

    // 根据应用状态自动推进步骤
    if (files && files.length > 0 && currentStep === 1) {
      setCurrentStep(2)
    } else if (selectedFields && selectedFields.length > 0 && currentStep <= 3) {
      setCurrentStep(4)
    } else if (statsReport && currentStep <= 4) {
      // 用户已完成所有步骤，可以选择自动关闭引导
      // setIsOnboardingVisible(false)
      // localStorage.setItem(ONBOARDING_KEY, 'true')
    }
  }, [files, selectedFields, statsReport, currentStep, isOnboardingVisible])

  const closeOnboarding = () => {
    setIsOnboardingVisible(false)
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }

  const showOnboarding = () => {
    setIsOnboardingVisible(true)
    setCurrentStep(1)
  }

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    setCurrentStep(1)
    setIsOnboardingVisible(true)
  }

  return {
    isOnboardingVisible,
    currentStep,
    closeOnboarding,
    showOnboarding,
    resetOnboarding
  }
}

export default useOnboarding