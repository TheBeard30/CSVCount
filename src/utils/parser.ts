import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { UploadedFile } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * 解析 CSV 文件
 */
const parseCSV = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV 解析错误: ${results.errors[0].message}`))
        } else {
          resolve(results.data as Record<string, any>[])
        }
      },
      error: (error) => {
        reject(new Error(`CSV 解析失败: ${error.message}`))
      },
    })
  })
}

/**
 * 解析 Excel 文件
 */
const parseExcel = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData as Record<string, any>[])
      } catch (error) {
        reject(new Error(`Excel 解析失败: ${(error as Error).message}`))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 解析上传的文件
 */
export const parseFile = async (file: File): Promise<UploadedFile> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  let data: Record<string, any>[]

  try {
    if (fileExtension === 'csv') {
      data = await parseCSV(file)
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      data = await parseExcel(file)
    } else {
      throw new Error('不支持的文件格式，请上传 CSV 或 Excel 文件')
    }

    // 提取字段名
    const fields = data.length > 0 ? Object.keys(data[0]) : []

    return {
      id: generateId(),
      name: file.name,
      size: file.size,
      uploadTime: new Date(),
      data,
      fields,
    }
  } catch (error) {
    throw new Error(`文件解析失败: ${(error as Error).message}`)
  }
}

/**
 * 验证文件大小
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * 验证文件类型
 */
export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['.csv', '.xlsx', '.xls']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  return allowedTypes.includes(fileExtension)
}