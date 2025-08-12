import { StorageData, UploadedFile, StatsReport } from '@/types'

const STORAGE_KEY = 'csv-count-data'

/**
 * 获取存储的数据
 */
export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      // 转换日期字符串为 Date 对象
      parsed.files = parsed.files.map((file: any) => ({
        ...file,
        uploadTime: new Date(file.uploadTime),
      }))
      if (parsed.lastReport) {
        parsed.lastReport.generatedAt = new Date(parsed.lastReport.generatedAt)
      }
      return parsed
    }
  } catch (error) {
    console.error('读取本地存储失败:', error)
  }
  return { files: [] }
}

/**
 * 保存数据到本地存储
 */
export const saveStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

/**
 * 添加文件到存储
 */
export const addFile = (file: UploadedFile): UploadedFile[] => {
  const data = getStorageData()
  data.files.push(file)
  saveStorageData(data)
  return data.files
}

/**
 * 从存储中删除文件
 */
export const removeFile = (fileId: string): UploadedFile[] => {
  const data = getStorageData()
  data.files = data.files.filter(file => file.id !== fileId)
  saveStorageData(data)
  return data.files
}

/**
 * 保存统计报告
 */
export const saveReport = (report: StatsReport): void => {
  const data = getStorageData()
  data.lastReport = report
  saveStorageData(data)
}

/**
 * 清除所有数据
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清除本地存储失败:', error)
  }
}

/**
 * 清除所有文件
 */
export const clearAllFiles = (): UploadedFile[] => {
  const data = getStorageData()
  data.files = []
  saveStorageData(data)
  return data.files
}

/**
 * 获取所有文件
 */
export const getAllFiles = (): UploadedFile[] => {
  return getStorageData().files
}

/**
 * 获取最后的报告
 */
export const getLastReport = (): StatsReport | undefined => {
  return getStorageData().lastReport
}