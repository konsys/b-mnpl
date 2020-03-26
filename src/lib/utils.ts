export const random = (min: number, max: number) => {
  return Math.ceil(min + Math.random() * (max - min));
};
