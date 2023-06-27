export function getInitialFilterItemNode (
  item: DirectusFilterItem,
  relationModel: CollectionRelationModel,
): FilterItemNode {
  return {
    ...item,
    checked: false,
    collectionName: relationModel.collectionName,
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
    name: relationModel.collectionName,
    collectionName: relationModel.collectionName,
  }
}
