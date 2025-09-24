import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Account, AccountType } from '@/types';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  // Load from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('accounts');
    if (saved) {
      try {
        accounts.value = JSON.parse(saved).map((acc: any) => ({
          ...acc,
          password: acc.type === 'LDAP' ? null : acc.password,
          errors: {},
        }));
      } catch (e) {
        console.error('Failed to load accounts');
      }
    }
  }

  watch(accounts, (val) => {
    localStorage.setItem('accounts', JSON.stringify(val));
  }, { deep: true });

  function addAccount() {
    accounts.value.push({
      id: Date.now().toString(),
      label: '',
      type: 'Локальная',
      login: '',
      password: '',
      errors: {},
    });
  }

  function removeAccount(id: string) {
    accounts.value = accounts.value.filter(a => a.id !== id);
  }

  function updateAccount(id: string, data: Partial<Account>) {
    const acc = accounts.value.find(a => a.id === id);
    if (acc) Object.assign(acc, data);
  }

  function validateAccount(id: string) {
    const acc = accounts.value.find(a => a.id === id);
    if (!acc) return;

    acc.errors = {};

    if (!acc.login.trim()) acc.errors.login = 'Обязательно';
    else if (acc.login.length > 100) acc.errors.login = 'Макс. 100 символов';

    if (acc.type === 'Локальная') {
      if (!acc.password || !acc.password.trim()) acc.errors.password = 'Обязательно';
      else if ((acc.password as string).length > 100) acc.errors.password = 'Макс. 100 символов';
    }
  }

  const accountsWithParsedLabels = computed(() => {
    return accounts.value.map(acc => ({
      ...acc,
      parsedLabel: acc.label
        .split(';')
        .map(s => s.trim())
        .filter(s => s)
        .map(text => ({ text })),
    }));
  });

  return {
    accounts,
    accountsWithParsedLabels,
    addAccount,
    removeAccount,
    updateAccount,
    validateAccount,
  };
});
