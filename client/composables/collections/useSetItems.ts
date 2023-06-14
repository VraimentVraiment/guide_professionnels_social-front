export function useSetItem(
  collectionModel: Ref<CollectionModel | null>,
  filtersCollections: Ref<FiltersCollection[]>,
) {
  function setItem({
    collectionName,
    id,
    value,
    isAltKeyPressed,
  }: {
    collectionName: string,
    id: number,
    value: any,
    isAltKeyPressed: boolean
  }) {
    const collection = filtersCollections.value
      .find(c => c.collectionName === collectionName);
    if (!collection) { return }

    const item = collection.items
      .find(i => i.id === id);
    if (!item) { return }

    item.checked = value;

    const relationModel = collectionModel.value?.relations
      ?.find((relation) => {
        return relation.collectionName === collectionName
      })
    if (!relationModel) { return }

    setItemCheckSideEffects({
      item,
      collection,
      relationModel,
      value,
      isAltKeyPressed,
    })
    item.checked = value
  }
  return setItem;
}

type CheckItemProps = {
  collection: FiltersCollection,
  item: FilterItemNode,
  value: boolean,
}

function setItemCheckSideEffects({
  collection,
  relationModel,
  isAltKeyPressed,
  item,
  value,
}: {
  collection: FiltersCollection,
  relationModel: CollectionRelationModel,
  item: FilterItemNode,
  value: boolean,
  isAltKeyPressed?: boolean,
}) {
  if (relationModel.userSelection === 'single-node') {
    collection.items.forEach(i => i.checked = false)
  } else if (
    isAltKeyPressed
    && (
      relationModel.userSelection === 'leaves-only'
      || relationModel.userSelection === 'all-nodes'
    )
  ) {
    nextTick(() => {
      setItemSiblings({ collection, item, value: false })
      nextTick(() => {
        if (!item?.checked) {
          item.checked = true
        }
      })
    })
  } else if (relationModel.userSelection === 'all-nodes') {
    nextTick(() => {
      setItemChildren({ collection, item, value })
      setItemParent({ collection, item, value })
    })
  }
}

export function setItemParent({
  collection,
  item,
  value,
}: CheckItemProps): void {
  const parent = collection.items
    .find(i => i.id === item.parent_id)

  const siblings = collection.items
    .filter(i => i.parent_id === item.parent_id)

  if (
    value === true
    && parent?.checked === false
  ) {
    parent.checked = true
    setItemParent({
      collection,
      item: parent,
      value,
    })
  }

  if (parent && siblings?.length) {

    const allSiblingsUnchecked = siblings
      .every(sibling => !sibling.checked)

    if (
      allSiblingsUnchecked
      && parent?.checked === true
    ) {
      parent.checked = false
      setItemParent({
        collection,
        item: parent,
        value,
      })
    }
  }
}
export function setItemChildren({
  collection,
  item,
  value,
}: CheckItemProps): void {
  const children = collection.items.filter(i => i.parent_id === item.id)
  children.forEach((child) => {
    child.checked = value
    setItemChildren({
      collection,
      item: child,
      value,
    })
  })
}

export function setItemSiblings({
  collection,
  item,
  value,
}: CheckItemProps): void {

  const parent = collection.items
    .find(i => i.id === item.parent_id)

  const siblings = collection.items
    .filter(i => i.parent_id === item.parent_id)
    .filter(i => i.id !== item.id)

  siblings?.forEach((sibling) => {
    sibling.checked = value
  })

  if (parent) {
    setItemSiblings({
      collection,
      item: parent,
      value,
    })
  }
}