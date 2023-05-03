<script setup lang="ts">

const props = defineProps<{
  tabListName: StringConstructor
  tabTitles: {
    title: string,
    icon: string,
  }[]
  tabIndex: TabIndexModel
}>()

const tabTitles = props.tabTitles
  .map(({ title, icon }, i) => {
    return {
      title,
      icon,
      tabId: `tab-${i}`,
      panelId: `tab-content-${i}`,
    }
  }) as unknown as ArrayConstructor
</script>

<template>
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :selected-tab-index="tabIndex.selected.value"
    :initial-selected-index="tabIndex.selected.value"
    @select-tab="(index: number) => tabIndex.select(index)"
  >
    <DsfrTabContent
      v-for="i in tabTitles.length"
      :key="i + 1"
      :panel-id="`tab-content-${i - 1}`"
      :tab-id="`tab-${i - 1}`"
      :selected="tabIndex.isSelected(i - 1)"
      :asc="false"
    >
      <slot :name="`tab-${i - 1}`" />
    </DsfrTabContent>
  </DsfrTabs>
</template>
