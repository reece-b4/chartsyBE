
export const isValidISODateString = (
  value: unknown,
  canBeNull = false
): boolean => {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value) &&
    !isNaN(Date.parse(value)) &&
    nullCheck(canBeNull, value)
  );
};

const nullCheck = (canBeNull: boolean, value: unknown): value is null => {
  return !canBeNull || (canBeNull && value !== null);
};