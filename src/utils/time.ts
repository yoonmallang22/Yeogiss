/**
 * 초 단위의 시간을 시, 분, 초로 변환하는 유틸 함수
 */
export const secondsToHMS = (seconds: number): [number, number, number] => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs];
};
