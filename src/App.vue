<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import { useAccountsStore } from '@/stores/accounts';
import AccountItem from '@/components/AccountItem.vue';



const store = useAccountsStore();
</script>

<template>
  <NCard title="Управление учетными записями" clss='card'>
    <NButton type="primary" class="btn" @click="store.addAccount">
      + Добавить учетную запись
    </NButton>

    <AccountItem
      v-for="acc in store.accounts"
      :key="acc.id"
      :account="acc"
    />
  </NCard>
</template>

<style scoped>
.card{
  max-width: 700px;
  margin: 20px auto;
}

.btn{
  margin-bottom: 20px;
}
</style>
