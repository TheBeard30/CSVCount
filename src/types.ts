export interface UploadedFile {
  id: string
  name: string
  size: number
  uploadTime: Date
  data: Record<string, any>[]
  fields: string[]
}

export interface FieldStats {
  fieldName: string
  totalCount: number
  uniqueCount: number
  values: ValueCount[]
}

export interface ValueCount {
  value: string | number | null
  count: number
  percentage: number
}

export interface StatsReport {
  selectedFields: string[]
  fieldStats: FieldStats[]
  totalRows: number
  generatedAt: Date
}

export interface StorageData {
  files: UploadedFile[]
  lastReport?: StatsReport
}