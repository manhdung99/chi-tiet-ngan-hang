export const convertTimestampToDateTime = (timestamp: string) => {
  const originalDate = new Date(timestamp);
  const year = originalDate.getUTCFullYear();
  const month = String(originalDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(originalDate.getUTCDate()).padStart(2, "0");
  const hours = String(originalDate.getUTCHours()).padStart(2, "0");
  const minutes = String(originalDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(originalDate.getUTCSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
export const convertDate = (isoDate: string) => {
  const date = new Date(isoDate);

  // Extract year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and format as two digits
  const day = String(date.getDate()).padStart(2, "0"); // Format as two digits

  // Create the "YYYY-MM-DD" formatted string
  return `${year}-${month}-${day}`;
};
export const changeMathJaxDes = (des: string) => {
  if (des != null) {
    des = des.replaceAll("mml:", "");
    des = des.replaceAll(":mml", "");
  }
  return des;
};
export const flattenObject = (formData: FormData, obj: any, prefix = "") => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(obj[key])) {
        // If it's an array, iterate over each item in the array
        obj[key].forEach((item: any, index: number) => {
          flattenObject(formData, item, `${propName}[${index}]`); // Pass formData as the first argument
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(formData, obj[key], propName); // Pass formData as the first argument
      } else {
        formData.append(propName, obj[key]);
      }
    }
  }
};
