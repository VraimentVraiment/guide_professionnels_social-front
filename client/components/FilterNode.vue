<script lang="ts" setup>

import { HierarchyNode } from 'd3-hierarchy'
import DetailsAccordion from '@/components/DetailsAccordion.vue'

defineProps<{
  node: HierarchyNode<FilterItemNode> | null
}>()

const filterStore = useFilterStore()

</script>

<template>
  <template v-if="node?.data">
    <DsfrCheckbox
      v-if="( 
        node.data.collectionName === 'types_dispositif'
        || (
          node.data.collectionName === 'caracteristiques_dispositif'
          && node.height === 0
        )
      )"
      :id="node.data.id.toString()"
      :name="node.data.name"
      :label="node.data.name"
      :small="!(
        node.data.collectionName === 'types_dispositif'
        && node.depth === 1
      )"
      :model-value="node.data.checked"
      @update:model-value="checked => filterStore.setItem({
        collectionName: node?.data.collectionName as string,
        itemId: node?.data.id,
        key: 'checked',
        value: checked,
      })"
    />
    <DsfrRadioButton
      v-else-if="(
        node.data.collectionName === 'thematiques'
      )"
      :name="node.data.collectionName"
      :label="node.data.name"
      :value="node.data.id"
      :model-value="node.data.id"
      :small="!(
        node.depth === 1
      )"
      @update:model-value="checked => filterStore.setItem({
        collectionName: node?.data.collectionName as string,
        itemId: node?.data.id,
        key: 'checked',
        value: checked,
      })"
    />
    <DetailsAccordion
      v-else-if="node.data.collectionName === 'caracteristiques_dispositif'
        && node.depth === 2
        && node.height === 1
      "
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
      <h5 v-if="node.depth === 1">
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
    <template
      v-if="(
        node.data.collectionName === 'types_dispositif'
        && node.depth === 1
      )"
    >
      <template v-if="node.children?.length">
        <FilterNode
          v-for="childNode in node.children"
          :key="childNode.data.id"
          :node="childNode"
        />
      </template>
    </template>
  </template>
</template>
