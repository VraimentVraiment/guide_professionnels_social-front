<script setup lang="ts">

defineEmits(['select-tab'])

type tabTitle = {
  title: string,
  icon: string,
}

defineProps<{
  tabListName: StringConstructor
  tabTitles: tabTitle[]
}>()

const getTabData = (
  { title, icon }: tabTitle,
  i: number,
) => {
  return {
    title,
    icon,
    tabId: `tab-${i}`,
    panelId: `tab-content-${i}`,
  } as unknown as string
}

const {
  prevNumber: prevIndex,
  number: index,
  select,
  isSelected,
} = useNumberObserver()

</script>

<template>
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles.map(getTabData)"
    :selected-tab-index="index"
    :initial-selected-index="index"
    @select-tab="index => {
      select(index)
      $emit('select-tab', index)
    }"
  >
    <DsfrTabContent
      v-for="i in tabTitles.length"
      :key="i"
      :class="['gps-tab-content']"
      :panel-id="`tab-content-${i - 1}`"
      :tab-id="`tab-${i - 1}`"
      :selected="isSelected(i - 1)"
      :asc="index > prevIndex"
    >
      <slot :name="`tab-${i - 1}`" />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<style lang="scss">
.gps-tab-content {
  padding-left: 1px !important;
  padding-right: 1px !important;
  padding-bottom: 1px !important;
}
.fr-tabs.gps-dispositifs-tabs {
  box-shadow: none;

  & .fr-tabs__tab {
    --background-default-grey: var(--background-alt-grey);
  }

  & .fr-tabs__panel {
    padding: 1.5rem 0 0;
  }

  &:before {
    box-shadow: inset 0 1px 0 0 var(--border-default-grey);
  }
}
</style>
