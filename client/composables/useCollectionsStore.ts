import { HierarchyNode } from "d3-hierarchy"

type CollectionModel = {
  label: string
  type: 'post' | 'taxonomy'
  collectionName: string
  relations?: CollectionRelationModel[]
}

type CollectionRelationModel = {
  label: string
  collectionName: string
  junctionCollectionName?: string
  junctionSourceKey?: string
  junctionTargetKey?: string
  relationType: 'many-to-one' | 'many-to-many'
  field?: string
  userSelection?: 'leaves-only' | 'all-nodes' | 'single-node'
}

type Collection = {
  model: CollectionModel
  items: Ref<unknown>[]
  rootNode?: HierarchyNode<DirectusFilterItem>
  checkedItems?: Ref<unknown>[]
}