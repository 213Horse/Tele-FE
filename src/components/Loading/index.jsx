import { ClockLoader } from 'react-spinners';

export function Loading({ size, color }) {
  return (
    <>
      <ClockLoader
        color={`${color}`}
        size={`${size}`}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </>
  );
}
