<script lang="ts" setup>

import { useMagicKeys } from '@vueuse/core'

type GpsFilterNodeProps = {
  node: HierarchyNode<GpsFilterItemNode> | null
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  isRootNode?: boolean
  dataCombination?: 'and' | 'or' | 'unique'
  parentName?: string
}

const props = defineProps<GpsFilterNodeProps>()

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

const shouldRenderNodeAs = props.node?.data
  ? getShouldRenderNodeAs(props)
  : null

const { current: currentKeysPressed } = useMagicKeys()
const isAltKeyPressed = computed(() => currentKeysPressed.has('alt'))

</script>

<template>
  <template v-if="node?.data">
    <DsfrRadioButton
      v-if="shouldRenderNodeAs?.radio()"
      :name="node.data.collectionName"
      :label="node.data.name"
      :value="node.data.id"
      :model-value="node.data.id"
      :checked="node.data.checked"
      small
      @update:model-value="() => setItem(node?.data, true)"
    />
    <DsfrCheckbox
      v-else-if="shouldRenderNodeAs?.checkbox()"
      :class="[
        'gps-filters-sidebar__checkbox',
        { 'all-nodes__checkbox': node.data.userSelection === 'all-nodes' },
        { 'leaves-only__checkbox': node.data.userSelection === 'leaves-only' },
        { 'is-checked': node.data.checked }
      ]"
      :name="node.data.collectionName"
      :label="node.data.name"
      :model-value="node.data.checked"
      small
      :data-node-depth="node.depth"
      @update:model-value="(checked: boolean) => setItem(node?.data, checked)"
    />
    <legend
      v-else-if="shouldRenderNodeAs?.title()"
      :class="[
        'gps-greatparent-legend'
      ]"
    >
      {{ node.data.name }}
    </legend>
    <GpsDetailsAccordion
      v-else-if="shouldRenderNodeAs?.accordionAndChildren()"
      :data-combination="node.data.combination"
      :has-active-content="node.children.some(child => child.data.checked)"
    >
      <template #summary>
        <legend
          :class="[
            'gps-parent-legend'
          ]"
        >
          {{ node.data.name }}
        </legend>
      </template>
      <template #content>
        <GpsFilterNode
          v-for="childNode in node.children"
          :key="childNode.data.id"
          :node="childNode"
          :post-store="props.postStore"
          :data-combination="node.data?.combination ?? 'and'"
          :parent-name="node.data.name"
        />
      </template>
    </GpsDetailsAccordion>
    <div
      v-if="shouldRenderNodeAs?.childrenInContainer()"
      v-show="(
        node.data.userSelection === 'leaves-only' ||
        node.depth === 0 ||
        node.data.checked
      )"
      :data-node-height="node.height"
      :data-combination="node.data?.combination ?? 'and'"
      :class="[
        'filter-node__children',
        `filter-node__children__${node.data.userSelection}`
      ]"
    >
      <GpsFilterNode
        v-for="childNode in node.children"
        :key="childNode.data.id"
        :node="childNode"
        :post-store="props.postStore"
      />
    </div>
  </template>
</template>

<style scoped lang="scss">
.filter-node__children {
  & .filter-node__children__all-nodes {
    margin-bottom: 1.5rem;
    padding-left: .5rem;
    margin-left: .5rem;
    margin-top: .75rem;
    border-left: 1px solid var(--border-default-grey);
  }
}
</style>

<style lang="scss">
.gps-filters-sidebar__checkbox {
  &:active {
    >label::before {
      background-color: var(--blue-france-sun-113-625-active) !important;
    }
  }

  &.all-nodes__checkbox {
    &>label {
      margin-left: 1.8em !important;

      &::before {
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
      &::before {
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
        &::before {
          content: "et";
        }
      }
    }

    [data-combination="or"] & {
      &.is-checked {
        &::before {
          content: "ou";
        }
      }
    }
  }
}
</style>
