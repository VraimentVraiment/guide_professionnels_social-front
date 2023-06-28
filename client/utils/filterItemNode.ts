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
