/**
 * 공백 포함 16자 이하 한글, 영어 허용
 * @param text 검사할 문자열
 * @returns 유효성 검사 결과
 */
export const validateCommonText = (text: string) => {
  const commonTextRegex = /^[가-힣a-zA-Z\s]+$/ // 한글, 영어, 공백만 허용 (숫자 X, 특수문자 X)

  return {
    lengthValid: text.length >= 1 && text.length <= 16,
    formatValid: commonTextRegex.test(text),
  }
}
