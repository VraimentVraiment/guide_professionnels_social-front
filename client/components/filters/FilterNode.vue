<script lang="ts" setup>

import { useMagicKeys } from '@vueuse/core'
import { type HierarchyNode } from 'd3-hierarchy'

const props = defineProps<{
  node: HierarchyNode<FilterItemNode> | null
  postStore: ReturnType<typeof useDispositifPostStore>
}>()

const { current: currentKeysPressed } = useMagicKeys()
const isAltKeyPressed = computed(() => currentKeysPressed.has('alt'))

const setItem = (
  item: FilterItemNode | undefined,
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
</script>

<template>
  <template v-if="node?.data">
    <DsfrRadioButton
      v-if="(
        node.data.userSelection === 'single-node'
        && node.depth > 0
      )"
      :name="node.data.collectionName"
      :label="node.data.name"
      :value="node.data.id"
      :model-value="node.data.id"
      small
      :checked="node.data.checked"
      @update:model-value="() => setItem(node?.data, true)"
    />
    <DsfrCheckbox
      v-else-if="(
        node.data.userSelection === 'all-nodes'
        && node.depth > 0
        || (
          node.data.userSelection === 'leaves-only'
          && node.height === 0
        )
      )"
      :id="node.data.id.toString()"
      :name="node.data.name"
      :label="node.data.name"
      small
      :class="[
        'gps-filters-sidebar__checkbox',
        { 'all-nodes__checkbox': node.data.userSelection === 'all-nodes' },
        { 'leaves-only__checkbox': node.data.userSelection === 'leaves-only' },
        { 'is-checked': node.data.checked }
      ]"
      :data-node-depth="node.depth"
      :model-value="node.data.checked"
      @update:model-value="(checked: boolean) => setItem(node?.data, checked)"
    />
    <h5
      v-else-if="(
        node.data.userSelection === 'leaves-only'
        && node.height === 2
      )"
    >
      {{ node.data.name }}
    </h5>
    <DetailsAccordion
      v-else-if="(
        node.data.userSelection === 'leaves-only'
        && node.height === 1
      )"
      :label="node.data.name"
      :data-combination="node.data.combination"
      :summary-tag="'h6'"
    >
      <template v-if="node.children?.length">
        <FilterNode
          v-for="childNode in node.children"
          :key="childNode.data.id"
          :node="childNode"
          :post-store="postStore"
        />
      </template>
    </DetailsAccordion>
    <div
      v-if="(
        node.data.userSelection === 'all-nodes'
        && node.children?.length
      )"
      v-show="(
        node.depth === 0
        || node.data.checked
      )"
      :data-node-height="node.height"
      :class="[
        'filter-node__children',
      ]"
    >
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
        :post-store="postStore"
      />
    </div>
    <div
      v-else-if="!(
        node.data.userSelection === 'leaves-only'
        && node.height === 1
      )
        && node.children?.length
      "
    >
      <FilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
        :post-store="postStore"
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
.gps-filters-sidebar__checkbox {

  &:active {
    >label:before {
      background-color: var(--blue-france-sun-113-625-active) !important;
    }
  }

  &.all-nodes__checkbox {

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

  &.leaves-only__checkbox {
    &.is-checked {
      &:before {
        position: absolute;
        left: -1.25rem;
        text-align: right;
        font-size: .85rem;
        font-weight: 600;
        color: var(--blue-france-sun-113-625);
      }
    }

    [data-combination="and"] & {
      &.is-checked {
        &:before {
          content: "et";
        }
      }
    }

    [data-combination="or"] & {
      &.is-checked {
        &:before {
          content: "ou";
        }
      }
    }
  }
}
</style>
