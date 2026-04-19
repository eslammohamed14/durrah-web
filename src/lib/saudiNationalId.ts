/**
 * Validates Saudi National ID / Iqama (10 digits, starts with 1 or 2, checksum).
 * Algorithm matches common open implementations (e.g. alhazmy13/Saudi-ID-Validator).
 */
export function isValidSaudiNationalId(value: string): boolean {
  const id = value.replace(/\s/g, "");
  if (!/^[12]\d{9}$/.test(id)) return false;

  let checksum = 0;
  for (let digit = 0; digit < 10; digit++) {
    const num = Number(id.charAt(digit));
    checksum +=
      digit % 2 === 0
        ? String(num * 2)
            .split("")
            .reduce((sum, d) => sum + Number(d), 0)
        : num;
  }

  return checksum % 10 === 0;
}
