import { t } from 'i18next';
import * as yup from 'yup';

// yup helpers

export function ipAddress(validateNetwork: boolean) { 
    return yup.string().when("$value", (value, schema) => {
    if (!value && !validateNetwork) {
      return schema;
    }
    if (!value && validateNetwork) {
      return schema.matches(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      t("Invalid IP address")
    );
    }
  });
}


export function portNumber(validateNetwork: boolean){   
    return yup.number().when('$value', (value, schema) => {
      if (!value && !validateNetwork) {
        return schema
        .integer()
        .nullable(true)
        .transform((_: any, val: any) => val === Number(val) ? val : null)
    }
    if (!value && validateNetwork) {
        return schema.typeError(t('Port must be a number'))
        .integer(t('Port must be a number'))
        .positive(t('Port number must be positive'))
        .max(65535, t('Port must less than 65535'));
    }
  });
}

export const networkValidation = yup.string()
.transform((value) => (value === ''|| value === null || value === undefined) ? undefined : value)
.matches(
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  t("Invalid IP address")
)
.optional();

export const portValidation = yup.number()
.transform((value) => (value === ''|| value === null || value === undefined) ? undefined : 
        (!isNaN(value) ? Number(value) : undefined))
.min(1, t("Port number must be greater than 0"))
.max(65535, t("Port must less than 65535"))
.optional();

export const widthValidation = yup.number()
.transform((value) => (value === ''|| value === null || value === undefined) ? undefined : 
        (!isNaN(value) ? Number(value) : undefined))
.min(20, t("Width must be greater than 20"))
.max(100, t("Width must be less than 100"))
.optional();