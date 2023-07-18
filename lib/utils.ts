export const cn = (...classNames: string[]) => {
  return classNames.filter(Boolean).join(' ');
};
