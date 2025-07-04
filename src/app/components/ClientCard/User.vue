<template>
  <div
    v-if="client.userId && client.userId !== '1'"
    class="block pb-1 text-xs text-gray-500 md:inline-block md:pb-0 dark:text-neutral-400"
  >
    <span class="inline-block">
      <template v-if="usersMap">
        {{ userName }}
      </template>
      <template v-else>
        {{ t('general.loading') }}
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ client: LocalClient }>();
const { t } = useI18n();
const usersMap = await useUsersMap();

const userName = computed(() => {
  const userId = props.client.userId;
  if (!userId) return t('general.unknown');
  if (userId === '1') return t('general.admin');
  return usersMap.value?.[userId] || userId;
});
</script>