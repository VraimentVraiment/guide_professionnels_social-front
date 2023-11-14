<script lang="ts" setup>

import { type HierarchyNode } from 'd3-hierarchy'

defineProps<{
  node: HierarchyNode<GpsFilterItemNode>
}>()

const emit = defineEmits(['update:node'])
</script>

<template>
  <DsfrCheckboxSet
    class="gps-checkbox-group"
    :name="node.data.name"
    small
    :options="node.children
      ?.map((child: HierarchyNode<GpsFilterItemNode>) => ({
        label: child.data.name,
        id: `${child.data.collectionName}--${child.data.id}}`,
        name: child.data.id.toString(),
      })) ?? []"
    :model-value="node.children
      ?.filter((child: HierarchyNode<GpsFilterItemNode>) => child.data?.checked)
      .map((child: HierarchyNode<GpsFilterItemNode>) => child.data.id.toString())
      ?? []"
    @update:model-value="ids => {
      node?.children
        ?.forEach((child: HierarchyNode<GpsFilterItemNode>) => {
          emit('update:node', child.data, ids.includes(child.data.id.toString()))
        })
    }"
  />
</template>

<style scoped lang="scss">

:deep(.fr-checkbox-group) {
  &:active {
    >label::before {
      background-color: var(--blue-france-sun-113-625-active) !important;
    }
  }

  transform: translateX(.25rem);

  &.fr-checkbox-group--sm input[type="checkbox"]+label::before {
    margin-top: 0.25rem !important;
  }

  input[type="checkbox"] {
    &+label::after {
      position: absolute;
      left: -2.75rem;
      top: .75rem;
      text-align: right;
      font-size: .85rem;
      font-weight: 600;
      color: var(--blue-france-sun-113-625);
    }

    [data-combination="and"] &:checked+label::after {
      content: "et";
    }

    [data-combination="or"] &:checked+label::after {
      content: "ou";
    }
  }
}

</style>
