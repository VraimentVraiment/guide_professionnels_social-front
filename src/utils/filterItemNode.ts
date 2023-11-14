/**
 * Assign some props to a filter item node (as fetched from backend) before it is added to the filter tree.
 */
export function getInitialFilterItemNode(
  item: DirectusFilterItem,
  relationModel: CollectionRelationModel,
): GpsFilterItemNode {
  return {
    ...item,
    checked: false,
    collectionName: relationModel.targetCollectionName,
    userSelection: relationModel.userSelection as UserSelection,
  }
}

/**
 * Create a root node for a filter before it is used to create it.
 */
export function getRootFilterItemNode(
  relationModel: CollectionRelationModel,
): GpsFilterItemNode {
  return {
    id: 0,
    parent_id: null,
    userSelection: relationModel.userSelection as UserSelection,
    name: relationModel.targetCollectionName,
    collectionName: relationModel.targetCollectionName,
  }
}
