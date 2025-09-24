<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import { useAccountsStore } from '@/stores/accounts';
import AccountItem from '@/components/AccountItem.vue';



const store = useAccountsStore();
</script>

<template>
  <NCard title="Управление учетными записями" style="max-width: 700px; margin: 20px auto;">
    <NButton type="primary" @click="store.addAccount" style="margin-bottom: 20px;">
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
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
