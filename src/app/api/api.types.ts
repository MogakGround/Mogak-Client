export interface BaseResponse<T> {
  code: number
  messgae: string
  data: T
}

export class ErrorResponse extends Error {
  success: boolean
  status: number
  code: number

  constructor(status: number, code: number, message: string) {
    super(message)
    this.success = false
    this.status = status
    this.code = code

    Object.setPrototypeOf(this, ErrorResponse.prototype)
  }
}
