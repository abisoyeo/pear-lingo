export class ErrorFormatter {
  static formatJoiError(error) {
    return error.details.map((d) => ({
      field: d.context.label,
      issue: d.message.replace(/"/g, ""),
      ...(this.shouldIncludeValue(d.context.label) && {
        value: d.context.value,
      }),
    }));
  }

  static createFieldError(field, issue, value = undefined) {
    const error = { field, issue };
    if (value && this.shouldIncludeValue(field)) {
      error.value = value;
    }
    return error;
  }

  static shouldIncludeValue(fieldName) {
    const sensitive = ["password", "confirmPassword", "token", "apiKey"];
    return !sensitive.includes(fieldName);
  }
}
