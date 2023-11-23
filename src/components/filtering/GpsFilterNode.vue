<script lang="ts" setup>

import { type HierarchyNode } from 'd3-hierarchy'

import { useMagicKeys } from '@vueuse/core'

const props = defineProps<{
  node: HierarchyNode<GpsFilterItemNode> | null
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  isRootNode?: boolean
  dataCombination?: 'and' | 'or' | 'unique'
  parentName?: string
}>()

const { current: currentKeysPressed } = useMagicKeys()
const isAltKeyPressed = computed(() => currentKeysPressed.has('alt'))

const setItem = (
  item: GpsFilterItemNode | undefined,
  checked: boolean,
): void => {
  if (!item) { return }
  props.postStore.setItem({
    collectionName: item.collectionName,
    id: item.id,
    value: checked,
    isAltKeyPressed: isAltKeyPressed.value,
  })
}

const expandedId = ref<string | undefined>()

</script>

<template>
  <template v-if="node?.data">
    <h4
      v-if="(
        !isRootNode &&
        node.data.userSelection === 'leaves-only' &&
        node.height === 2
      )"
      :class="[
        'gps-accordion-group-legend',
        'fr-text--md',
      ]"
    >
      {{ node.data.name }}
    </h4>
    <DsfrAccordion
      v-if="(
        !isRootNode &&
        node.children?.length &&
        (
          node.data.userSelection === 'leaves-only' &&
          node.height === 1
        )
      )"
      :class="[
        { 'has-active-content': node.children?.some(child => child.data.checked) }
      ]"
      :expanded-id="expandedId"
      :title="node.data.name"
      @expand="event => expandedId = event"
    >
      <GpsFilterRadioSet
        v-if="node.data.combination === 'unique'"
        :node="node"
        @update:node="(node, value) => {
          setItem(node, value)
        }"
      />
      <GpsFilterCheckboxSet
        v-else
        :node="node"
        :data-combination="node.data.combination"
        @update:node="(node, value) => {
          setItem(node, value)
        }"
      />
    </DsfrAccordion>
    <DsfrCheckboxSet
      v-else-if="(
        !isRootNode && (
          node.data.userSelection === 'leaves-only' &&
          node.height === 0 &&
          node.depth === 1
        )
      )"
      :name="node.data.name"
      small
      :options="[
        {
          label: node.data.name,
          id: `${node.data.collectionName}--${node.data.id}}`,
          name: node.data.id.toString(),
        }
      ]"
      :model-value="node.data.checked ? [node.data.id.toString()] : []"
      @update:model-value="ids => {
        if (node) {
          setItem(node.data, ids.includes(node.data.id.toString()))
        }
      }"
    />
    <GpsFilterRadioSet
      v-else-if="(
        node.height === 1 &&
        node.data.userSelection === 'single-node'
      )"
      :node="node"
      @update:node="node => {
        setItem(node, true)
      }"
    />
    <GpsFilterCheckboxDeepSet
      v-else-if="(
        node.depth === 0 &&
        node.data.userSelection === 'all-nodes'
      )"
      :node="node"
      @update:node="(node, value) => {
        setItem(node, value)
      }"
    />
    <template v-else>
      <GpsFilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
        :post-store="props.postStore"
      />
    </template>
  </template>
</template>

<style scoped lang="scss">
.gps-accordion-group-legend {
  margin-bottom: .75rem;
  margin-top: .5rem;

  .fr-accordion + & {
    margin-top: 2rem;
  }
}
</style>
