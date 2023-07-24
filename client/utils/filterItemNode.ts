/**
 * Assign some props to a filter item node before it is added to the tree.
 */
export function getInitialFilterItemNode (
  item: DirectusFilterItem,
  relationModel: CollectionRelationModel,
): FilterItemNode {
  return {
    ...item,
    checked: false,
    collectionName: relationModel.targetCollectionName,
    userSelection: relationModel.userSelection as UserSelection,
  }
}

/**
 * Assign some props to the root node item before it is added to the tree.
 */
export function getRootFilterItemNode (
  relationModel: CollectionRelationModel,
): FilterItemNode {
  return {
    id: 0,
    parent_id: null,
    userSelection: relationModel.userSelection as UserSelection,
    name: relationModel.targetCollectionName,
    collectionName: relationModel.targetCollectionName,
  }
}
