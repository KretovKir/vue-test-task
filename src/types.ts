export type AccountType = 'LDAP' | 'Локальная';

export interface LabelItem {
  text: string;
}

export interface Account {
  id: string;
  label: string; // исходная строка (до преобразования)
  type: AccountType;
  login: string;
  password: string | null;
  // для валидации:
  errors: {
    login?: string;
    password?: string;
  };
}