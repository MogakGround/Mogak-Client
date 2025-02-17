// 배경색
export enum ToggleTheme {
  LIGHT,
  DARK,
}

// 부모 컴포넌트에서 다음과 같은 변수 함수 전달
/*
const [isOn, setIsOn] = useState<boolean>(true);
const handleToggle = () => {
    setIsOn(!isOn); // 현재 상태의 반대로 설정
};
*/
// 공통 프롭스
interface ToggleProps {
  theme: ToggleTheme

  // 초기 상태
  isOn: boolean

  // 토글 이벤트
  onToggle: () => void

  //각 토글 className
  className?: string
}

// 텍스트 토글
export interface TextToggleProps extends ToggleProps {
  textl: string
  textr: string
}
