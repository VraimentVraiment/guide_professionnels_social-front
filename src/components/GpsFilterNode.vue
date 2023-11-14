<script lang="ts" setup>

import { type HierarchyNode } from 'd3-hierarchy'

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

const expandedId = ref<string | undefined>()

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
    <DsfrAccordion
      v-else-if="shouldRenderNodeAs?.accordionAndChildren()"
      :expanded-id="expandedId"
      :title="node.data.name"
      @expand="event => expandedId = event"
    >
      <DsfrRadioButtonSet
        v-if="node.data.combination === 'unique'"
        :name="node.data.name"
        small
        :options="node.children
          ?.map((child: HierarchyNode<GpsFilterItemNode>) => ({
            label: child.data.name,
            value: child.data.id.toString(),
          })) ?? []"
        :model-value="node.children
          ?.find((child: HierarchyNode<GpsFilterItemNode>) => child.data?.checked)
          ?.data.id.toString()
          ?? ''"
        @update:model-value="id => {
          console.log('id :', id);
          node?.children
            ?.forEach((child: HierarchyNode<GpsFilterItemNode>) => {
              setItem(child.data, child.data.id.toString() === id)
            })
        }"
      />
      <DsfrCheckboxSet
        v-else
        :name="node.data.name"
        small
        :options="node.children
          ?.map((child: HierarchyNode<GpsFilterItemNode>) => ({
            label: child.data.name,
            id: child.data.id.toString(),
            name: child.data.id.toString(),
          })) ?? []"
        :model-value="node.children
          ?.filter((child: HierarchyNode<GpsFilterItemNode>) => child.data?.checked)
          .map((child: HierarchyNode<GpsFilterItemNode>) => child.data.id.toString())
          ?? []"
        @update:model-value="ids => {
          console.log(ids)
          node?.children
            ?.forEach((child: HierarchyNode<GpsFilterItemNode>) => {
              setItem(child.data, ids.includes(child.data.id.toString()))
            })
        }"
      />
    </DsfrAccordion>
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
    border-left: 1px solid var(--border-default-grey);
    margin-bottom: 1.5rem;
    padding-left: .5rem;
    margin-left: .5rem;
    margin-top: .75rem;
  }
}

legend.gps-greatparent-legend {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: .75rem;

  &:first-child {
    margin-top: .5rem;
  }

  &:not(:first-child) {
    margin-top: 2rem;
  }
}

legend.gps-parent-legend {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
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
    .filter-node__children[data-node-height="3"] > & {
      padding: 0.5rem 1rem 0.5rem 0.5rem;

      // margin-top: 0.5rem;
    }

    &.is-checked {
      &::before {
        position: absolute;
        left: -1rem;
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
