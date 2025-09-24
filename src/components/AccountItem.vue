<script setup lang="ts">
import { NInput, NSelect, NButton, NFormItem } from 'naive-ui';
import { useAccountsStore } from '@/stores/accounts';
import type { AccountType } from '@/types';

const props = defineProps<{ account: any }>();
const store = useAccountsStore();

const accountTypes = [
  { label: 'LDAP', value: 'LDAP' as AccountType },
  { label: 'Локальная', value: 'Локальная' as AccountType },
];

function handleBlur(field: 'login' | 'password' | 'label') {
  store.validateAccount(props.account.id);
}

function handleTypeChange(value: AccountType) {
  store.updateAccount(props.account.id, {
    type: value,
    password: value === 'LDAP' ? null : '',
  });
  store.validateAccount(props.account.id);
}
</script>

<template>
  <div style="border: 1px solid #eee; padding: 16px; margin: 12px 0; border-radius: 6px;">
    <NFormItem label="Метка" :show-feedback="false">
      <NInput
        v-model:value="account.label"
        placeholder="work; admin"
        maxlength="50"
        @blur="handleBlur('label')"
      />
      <div style="font-size: 12px; color: #888; margin-top: 4px;">
        Максимум 50 символов. Ввод через ;
      </div>
    </NFormItem>

    <NFormItem label="Тип записи" :show-feedback="false">
      <NSelect
        v-model:value="account.type"
        :options="accountTypes"
        @update:value="handleTypeChange"
      />
    </NFormItem>

    <NFormItem
      label="Логин"
      :validation-status="account.errors.login ? 'error' : undefined"
      :feedback="account.errors.login"
    >
      <NInput
        v-model:value="account.login"
        maxlength="100"
        @blur="handleBlur('login')"
      />
    </NFormItem>

    <NFormItem
      v-if="account.type === 'Локальная'"
      label="Пароль"
      :validation-status="account.errors.password ? 'error' : undefined"
      :feedback="account.errors.password"
    >
      <NInput
        v-model:value="account.password"
        type="password"
        maxlength="100"
        @blur="handleBlur('password')"
      />
    </NFormItem>

    <NButton type="error" size="small" @click="() => store.removeAccount(account.id)" style="margin-top: 8px;">
      Удалить
    </NButton>
  </div>
</template>
