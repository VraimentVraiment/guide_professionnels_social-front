<script lang="ts" setup>

import { type HierarchyNode } from 'd3-hierarchy'

defineProps<{
  node: HierarchyNode<GpsFilterItemNode>
}>()

const emit = defineEmits(['update:node'])
</script>

<template>
  <DsfrRadioButtonSet
    :name="node.data.name"
    small
    :options="node.children
      ?.map((child: HierarchyNode<GpsFilterItemNode>) => ({
        label: child.data.name,
        value: child.data.id,
      })) ?? []"
    :model-value="node.children
      ?.find((child: HierarchyNode<GpsFilterItemNode>) => child.data?.checked)
      ?.data.id
      ?? 0"
    @update:model-value="id => {
      const item = node?.children
        ?.find((child: HierarchyNode<GpsFilterItemNode>) => {
          return child.data.id === id
        }) ?? null

      if (item) {
        emit('update:node', item.data, true)
      }
    }"
  />
</template>

<style scoped lang="scss">
</style>
