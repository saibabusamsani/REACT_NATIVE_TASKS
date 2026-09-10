import { LoginPayload } from '../../types/auth.type';

export type FieldName = keyof LoginPayload;
export type FieldErrors = Partial<Record<FieldName, string>>;

export interface FormState {
  values: LoginPayload;
  errors: FieldErrors;
  showPassword: boolean;
}

export type LoginStatus = 1 | 2 | 5;
