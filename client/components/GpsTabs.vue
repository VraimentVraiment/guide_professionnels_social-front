<script setup lang="ts">

const props = defineProps<{
  tabListName: StringConstructor
  tabTitles: object[]
  tabIndex: TabIndexModel
}>()

const tabTitles = props.tabTitles
  .map((item, i) => {
    return {
      ...item,
      tabId: `tab-${i}`,
      panelId: `tab-content-${i}`,
    }
  }) as unknown as ArrayConstructor
</script>

<template>
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :initial-selected-index="tabIndex.selected.value"
    @select-tab="(index: number) => tabIndex.select(index)"
  >
    <DsfrTabContent
      v-for="i in tabTitles.length"
      :key="i + 1"
      :panel-id="`tab-content-${i - 1}`"
      :tab-id="`tab-${i - 1}`"
      :selected="tabIndex.isSelected(i - 1)"
    >
      <slot :name="`tab-${i - 1}`" />
    </DsfrTabContent>
  </DsfrTabs>
</template>
