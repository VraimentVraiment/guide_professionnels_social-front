<script lang="ts" setup>

import { useMagicKeys } from '@vueuse/core'
import { type HierarchyNode } from 'd3-hierarchy'

defineProps<{
  node: HierarchyNode<FilterItemNode> | null
}>()

const filterStore = useFilterStore()

const { current: currentKeysPressed } = useMagicKeys()
const isAltKeyPressed = computed(() => currentKeysPressed.has('alt'))

const setItem = (
  item: FilterItemNode,
  checked: boolean,
): void => {
  filterStore.setItem({
    collectionName: item.collection.name,
    id: item.id,
    value: checked,
    isAltKeyPressed: isAltKeyPressed.value,
  })
}
</script>

<template>
  <template
    v-if="(
      node?.data
      && !node.data.hidden
    )"
  >
    <DsfrRadioButton
      v-if="(
        node.data.collection?.userSelection === 'single-node'
      )"
      :name="node.data.collection.name"
      :label="node.data.name"
      :value="node.data.id"
      :model-value="node.data.id"
      small
      @update:model-value="() => setItem(node?.data as FilterItemNode, true)"
    />
    <DsfrCheckbox
      v-else-if="(
        node.data.collection?.userSelection === 'all-nodes'
        || (
          node.data.collection?.userSelection === 'leaves-only'
          && node.height === 0
        )
      )"
      :id="node.data.id.toString()"
      :name="node.data.name"
      :label="node.data.name"
      small
      :class="[
        'gps-filters-sidebar__checkbox',
        {'all-nodes__checkbox': node.data.collection?.userSelection === 'all-nodes'}
      ]"
      :data-node-depth="node.depth"
      :model-value="node.data.checked"
      @update:model-value="(checked) => setItem(node?.data as FilterItemNode, checked as boolean)"
    />
    <h5
      v-else-if="(
        node.data.collection?.userSelection === 'leaves-only'
        && node.height === 2
      )"
    >
      {{ node.data.name }}
    </h5>
    <DetailsAccordion
      v-else-if="(
        node.data.collection?.userSelection === 'leaves-only'
        && node.height === 1
      )"
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
    <div
      v-if="(
        node.data.collection?.userSelection === 'all-nodes'
        && node.children?.length
      )"
      v-show="node.data.checked"
      :data-node-height="node.height"
      :class="[
        'filter-node__children',
      ]"
    >
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
      />
    </div>
    <div
      v-else-if="!(
        node.data.collection?.userSelection === 'leaves-only'
        && node.height === 1
      )
        && node.children?.length
      "
    >
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
      />
    </div>
  </template>
</template>

<style scoped lang="scss">
.filter-node__children {
  margin-left: .5rem;
  margin-top: .75rem;
  margin-bottom: 1.5rem;
  padding-left: .5rem;
  border-left: 1px solid var(--border-default-grey);
}
</style>

<style lang="scss">
.gps-filters-sidebar__checkbox.all-nodes__checkbox {

  &>label {
    margin-left: 1.8em !important;

    &:before {
      left: -1.8em !important;
      margin-top: 0.1em !important;
      width: 1.4em !important;
      height: 1.4em !important;
    }
  }

  &[data-node-depth="1"] {
    font-size: 1.05rem;
    font-weight: 400;
  }

  &[data-node-depth="2"] {
    font-size: .975rem;
    font-weight: 400;
  }

  &[data-node-depth="3"] {
    font-size: .925rem;
    font-weight: 600;
  }
}
</style>