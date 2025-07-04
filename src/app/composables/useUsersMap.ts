import { ref } from 'vue';

const usersMap = ref<Record<string, string> | null>(null);

export async function useUsersMap() {
  if (usersMap.value === null) {
    try {
      const { data } = await useFetch('/api/users/', { method: 'get' });
      if (Array.isArray(data.value)) {
        usersMap.value = Object.fromEntries(
          data.value.map((u: { id: string; name: string }) => [u.id, u.name])
        );
      } else {
        usersMap.value = {};
      }
    } catch {
      usersMap.value = {};
    }
  }
  return usersMap;
}