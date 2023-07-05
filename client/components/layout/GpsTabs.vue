<script setup lang="ts">

defineEmits(['select-tab'])

type tabTitle = {
  title: string,
  icon: string,
}

withDefaults(defineProps<{
  tabListName: StringConstructor
  tabTitles: tabTitle[],
  maxHeight: string
}>(), {
  maxHeight: 'none',
})

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
  set: selectIndex,
  is: isSelected,
} = useNumberObserver()

</script>

<template>
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles.map(getTabData)"
    :selected-tab-index="index"
    :initial-selected-index="index"
    @select-tab="(index: number) => {
      selectIndex(index)
      $emit('select-tab', index)
    }"
  >
    <DsfrTabContent
      v-for="i in tabTitles.length"
      :key="i"
      :class="[
        'gps-tab-content'
      ]"
      :panel-id="`tab-content-${i - 1}`"
      :tab-id="`tab-${i - 1}`"
      :selected="isSelected(i - 1)"
      :asc="index > prevIndex"
      :style="{
        maxHeight: maxHeight,
      }"
    >
      <slot :name="`tab-${i - 1}`" />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<style lang="scss">
@import "@/styles/";

.gps-dispositifs-tabs {
  transition: none;
  box-shadow: none;
  border-bottom: solid 1px var(--border-default-grey);
  margin-top: 3rem;

  @include sm {
    margin-top: 0;
  }

  &::before {
    box-shadow: inset 0 1px 0 0 var(--border-default-grey);
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 10;
    height: 2px;
    width: 100%;
    left: 0;
    bottom: 0;
    box-shadow: inset 0 2px 0 0 var(--background-alt-grey);
  }

  .fr-tabs__tab {
    --background-default-grey: var(--background-alt-grey);
    --background-default-grey-active: var(--background-alt-grey);

    &[aria-selected="true"] {
      cursor: default;
    }
  }

  .fr-tabs__panel {
    padding: 1.5rem 0 0;
  }
}

.gps-tab-content {
  margin-top: 2px;
  overflow-y: auto;
}
</style>
