import { useTheme } from '@/app/providers/ThemeProvider';
import getCommonStyles from '@/app/styles/common';

export const useAppStyles = () => {
  const { mode } = useTheme();
  return getCommonStyles(mode ?? 'light');
};

export default useAppStyles;
