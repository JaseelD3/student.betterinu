export type FeeInstalment = {
  id: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "overdue"
  paymentLogId?: string
}

export type FeeDetail = {
  id: string
  courseId: string
  courseTitle: string
  totalAmount: number
  paidAmount: number
  outstandingBalance: number
  nextInstalmentAmount?: number
  nextInstalmentDueDate?: string
  instalments: FeeInstalment[]
  currency: string
}
