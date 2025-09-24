import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Account, LabelItem } from '@/types';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  // Загрузка из localStorage при инициализации
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('accounts');
    if (saved) {
      try {
        accounts.value = JSON.parse(saved);
      } catch (e) {
        console.error('Нет данных');
      }
    }
  }

  // Автоматическое сохранение в localStorage
  watch(accounts, (newVal) => {
    localStorage.setItem('accounts', JSON.stringify(newVal));
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
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  }

  function updateAccount(id: string, updates: Partial<Account>) {
    const acc = accounts.value.find(a => a.id === id);
    if (acc) {
      Object.assign(acc, updates);
    }
  }

  function validateAccount(id: string) {
    const acc = accounts.value.find(a => a.id === id);
    if (!acc) return;

    acc.errors = {};

    if (!acc.login.trim()) {
      acc.errors.login = 'Логин обязателен';
    } else if (acc.login.length > 100) {
      acc.errors.login = 'Максимум 100 символов';
    }

    if (acc.type === 'Локальная') {
      if (!acc.password || !acc.password.trim()) {
        acc.errors.password = 'Пароль обязателен';
      } else if (acc.password.length > 100) {
        acc.errors.password = 'Максимум 100 символов';
      }
    }

    // Валидация метки (не обязательна, но проверим длину)
    if (acc.label.length > 50) {
      // Можно показать ошибку или просто обрезать — по ТЗ только "максимум 50"
      // Оставим без ошибки, но при сохранении обрежем
    }
  }

  // Преобразование метки в массив объектов
  const accountsWithParsedLabels = computed(() => {
    return accounts.value.map(acc => ({
      ...acc,
      parsedLabel: acc.label
        .split(';')
        .map(s => s.trim())
        .filter(s => s)
        .map(text => ({ text })) as LabelItem[],
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