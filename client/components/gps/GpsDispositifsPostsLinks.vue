<script setup lang="ts">
import { HierarchyNode } from 'd3-hierarchy'

defineProps<{
  rootNode: HierarchyNode<FilterItemNode>,
}>()

const openDetails = useCollectionObserver<Number>()

</script>

<template>
  <div
    :class="[
      'gps-links'
    ]"
  >
    <details
      v-for="node in rootNode.children"
      :key="node.data.id"
      :open="openDetails.has(node.data.id)"
      :class="[
        'gps-links-group'
      ]"
      @click.prevent
    >
      <summary>
        <GpsDispositifsPostsLink
          :id="node.data.id"
          :name="node.data.name"
          size="MD"
        />
        <DsfrButton
          v-if="node?.children?.length"
          label="Voir plus"
          primary
          icon-only
          size="small"
          :icon="!openDetails.has(node.data.id) ? 'ri-add-line' : 'ri-subtract-line'"
          @click="() => openDetails.toggle(node.data.id)"
        />
      </summary>
      <div
        v-if="node?.children?.length"
        :class="[
          'gps-link-group__children'
        ]"
      >
        <GpsDispositifsPostsLink
          v-for="childNode in node.children"
          :id="childNode.data.id"
          :key="childNode.data.id"
          :name="childNode.data.name"
          size="SM"
        />
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">
.gps-links {
  padding: 1rem;
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
}

details.gps-links-group {
  +details.gps-links-group {
    margin-top: 1.5rem;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;

    button {
      padding: .065rem .5rem;
    }
  }

  .gps-link-group__children {
    padding-left: 1rem;
    padding-right: 5rem;
    display: flex;
    flex-direction: column;
  }
}
</style>
