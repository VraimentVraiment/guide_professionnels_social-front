<script lang="ts" setup>

import { HierarchyNode } from 'd3-hierarchy'

defineProps<{
  node: HierarchyNode<FilterItemNode>;
  collectionName: string;
}>()

const getTag = (depth: number) => {
  switch (depth) {
    case 1:
      return 'h5'
    case 2:
      return 'h6'
    default:
      return 'h6'
  }
}

const getLabel = (node: HierarchyNode<FilterItem>) => {
  if (node.depth === 0) {
    return node.data.collectionName
  }
  return node.data.name
}

</script>

<template>
  <DsfrCheckbox
    v-if="node.height === 0 && node.depth !== 0"
    :id="node.data.id.toString()"
    v-model="node.data.checked"
    :name="node.data.name"
    :label="node.data.name"
  />
  <component
    :is="getTag(node.depth)"
    v-else-if="node.depth > 0"
  >
    {{ getLabel(node) }}
  </component>
  <template v-if="node.children?.length">
    <FilterNode
      v-for="childNode in node.children"
      :key="childNode.data.id"
      :node="childNode"
      :collection-name="collectionName"
    />
  </template>
</template>
