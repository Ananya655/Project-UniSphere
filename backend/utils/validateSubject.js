/**
 * Subject Validation
 * Validates subject create and list query parameters.
 */

/**
 * Parse a positive integer from a string value.
 */
const parsePositiveInt = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number.parseInt(String(value).trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

/**
 * Validate subject creation body.
 * @param {object} body
 * @returns {{ isValid: boolean, message?: string, errors?: string[], data?: object }}
 */
const validateCreateSubjectInput = (body) => {
  const errors = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const branch = typeof body.branch === 'string' ? body.branch.trim() : '';
  const semester = parsePositiveInt(body.semester);

  if (!name) errors.push('Subject name is required');
  if (!branch) errors.push('Branch is required');
  if (!body.semester && body.semester !== 0) errors.push('Semester is required');

  if (body.semester !== undefined && body.semester !== null && body.semester !== '' && semester === null) {
    errors.push('Semester must be a valid number');
  } else if (semester !== null && (semester < 1 || semester > 8)) {
    errors.push('Semester must be between 1 and 8');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: errors[0],
      errors,
    };
  }

  return {
    isValid: true,
    data: { name, branch, semester },
  };
};

/**
 * Validate subject list query parameters.
 * @param {object} query
 * @returns {{ isValid: boolean, message?: string, filters?: object }}
 */
const validateSubjectListQuery = (query) => {
  const branch = typeof query.branch === 'string' ? query.branch.trim() : '';
  const semester = parsePositiveInt(query.semester);

  if (!branch) {
    return { isValid: false, message: 'Branch is required' };
  }

  if (!query.semester && query.semester !== 0) {
    return { isValid: false, message: 'Semester is required' };
  }

  if (semester === null) {
    return { isValid: false, message: 'Semester must be a valid number' };
  }

  if (semester < 1 || semester > 8) {
    return { isValid: false, message: 'Semester must be between 1 and 8' };
  }

  return {
    isValid: true,
    filters: { branch, semester },
  };
};

module.exports = { validateCreateSubjectInput, validateSubjectListQuery };
