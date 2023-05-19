export const cls = (...classNames: string[]) => {
  return classNames.filter(Boolean).join(' ');
};
