export const addStaticLink = (description: string | null) => {
  if (description) {
    if (!description.includes('src="http')) {
      description = description.replaceAll(
        `src="`,
        `src="https://static.eduso.vn`
      );
      description = description.replaceAll(
        `src='`,
        `src='https://static.eduso.vn`
      );
    }
    return description;
  } else {
    return "";
  }
};
