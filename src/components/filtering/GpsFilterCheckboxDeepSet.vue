<script lang="ts" setup>

import { type HierarchyNode } from 'd3-hierarchy'

const props = defineProps<{
  node: HierarchyNode<GpsFilterItemNode>
}>()

const emit = defineEmits(['update:node'])

const patchNodeDisplay = (node: HierarchyNode<GpsFilterItemNode>) => {
  const id = `${node.data.collectionName}--${node.data.id}`
  nextTick(() => {
    const el = document.getElementById(id)?.parentElement
    if (el) {
      el.setAttribute('data-node-depth', node.depth.toString())
      const isVisible = (
        node.depth === 1 ||
        node.parent?.children?.some(child => child.data.checked)
      )

      el.style.display = isVisible
        ? 'block'
        : 'none'
    }
  })
}

onMounted(() => {
  props.node.descendants().forEach(patchNodeDisplay)
})

const getOptions = (node: HierarchyNode<GpsFilterItemNode>) => {
  patchNodeDisplay(node)

  return [{
    label: node.data.name,
    id: `${node.data.collectionName}--${node.data.id}`,
    name: node.data.id.toString(),
  }]
}

const getOptionsRecursive = (
  node: HierarchyNode<GpsFilterItemNode>,
): {
  label: string
  id: string
  name: string
}[] => {
  const selfOptions = getOptions(node)
  const recursiveOptions = node.children
    ?.flatMap(getOptionsRecursive) ?? []

  return [...selfOptions, ...recursiveOptions]
}

type DsfrCheckboxChangeEvent = InputEvent & {
  target: {
    id: string,
    checked: boolean
  }
}

</script>

<template>
  <DsfrCheckboxSet
    :name="node.data.name"
    :options="node.children?.flatMap(getOptionsRecursive) ?? []"
    :model-value="node
      .descendants()
      .filter(child => {
        return child.data?.checked
      })
      .map((child: HierarchyNode<GpsFilterItemNode>) => {
        return child.data.id.toString()
      })
      ?? []"
    @change="(event: DsfrCheckboxChangeEvent) => {
      const id = event.target?.id.split('--')[1]
      const child = node
        .descendants()
        .find((child: HierarchyNode<GpsFilterItemNode>) => {
          return child.data.id.toString() === id
        }) ?? null
      if (child) {
        emit('update:node', child.data, event.target?.checked)
      }
    }"
  />
</template>

<style scoped lang="scss">
:deep(.fr-checkbox-group) {
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
    label {
      font-size: 1.05rem !important;
    }

    font-weight: 400;
  }

  &[data-node-depth="2"] {
    margin-left: .5rem !important;
    padding-left: .5rem !important;
    border-left: 1px solid var(--border-default-grey);
    font-weight: 400;
    position: relative;
    transform: translateY(-.5rem);

    label {
      font-size: .975rem !important;
    }
  }

  &[data-node-depth="3"] {
    border-left: 1px solid var(--border-default-grey);
    margin-left: .5rem !important;
    padding-left: 1.5rem !important;
    font-weight: 600;
    transform: translateY(-.75rem);

    &::before {
      content: '';
      margin-right: .5rem;
      position: absolute;
      left: 1rem;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: var(--border-default-grey);
    }

    label {
      font-size: .925rem !important;
    }
  }
}
</style>
