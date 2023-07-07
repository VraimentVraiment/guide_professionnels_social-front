<script setup lang="ts">

defineProps<{
  id: number,
  name: string,
  size: 'MD' | 'SM',
}>()

const postStore = useDispositifPostStore()

</script>

<template>
  <NuxtLink
    :class="[
      'gps-link',
      {'gps-link__MD': size === 'MD'},
      {'gps-link__SM': size === 'SM'},
      'fr-link',
    ]"
    :to="`/dispositifs`"
    @click="() => postStore.setItem({
      collectionName: 'gps_typesdispositif',
      id,
      value: true,
    })"
  >
    {{ name }}
    <v-icon
      :name="'ri-arrow-right-line'"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<style scoped lang="scss">
.gps-link {
  display: block;

  &.gps-link__MD {
    font-size: 18px;
    margin-right: 2rem;
  }

  &.gps-link__SM {
    margin-top: 0.75rem;
    display: inline-block;
    margin-right: auto;
  }
}
</style>
