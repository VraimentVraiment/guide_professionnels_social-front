<script lang="ts" setup>

import { HierarchyNode } from 'd3-hierarchy'
import DetailsAccordion from '@/components/DetailsAccordion.vue'

defineProps<{
  node: HierarchyNode<FilterItemNode>;
}>()

</script>

<template>
  <DsfrCheckbox
    v-if="node.height === 0 && node.depth !== 0"
    :id="node.data.id.toString()"
    v-model="node.data.checked"
    :name="node.data.name"
    :label="node.data.name"
    small
  />
  <DetailsAccordion
    v-else-if="node.depth === 2 && node.height === 1"
    :label="node.data.name"
    :summary-tag="'h6'"
  >
    <template v-if="node.children?.length">
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
      />
    </template>
  </DetailsAccordion>
  <template v-else>
    <h5
      v-if="node.depth === 1"
    >
      {{ node.data.name }}
    </h5>
    <template v-if="node.children?.length">
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
      />
    </template>
  </template>
</template>
