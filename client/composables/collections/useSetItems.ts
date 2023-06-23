type CheckItemProps = {
  collection: FiltersCollection,
  item: FilterItemNode,
  value: boolean,
  isAltKeyPressed?: boolean,
}

export function useSetItem (
  filtersCollections: Ref<FiltersCollection[]>,
  postsCollectionModel: Ref<CollectionModel>,
) {
  function setItem ({
    collectionName,
    id,
    value,
    isAltKeyPressed,
  }: {
    collectionName: string,
    id: number,
    value: any,
    isAltKeyPressed?: boolean
  }) {
    const collection = filtersCollections.value
      .find(c => c.collectionName === collectionName)
    if (!collection) { return }

    const item = collection.items
      .find(i => i.id === id)
    if (!item) { return }

    item.checked = value

    const relationModel = getRelationModel(postsCollectionModel.value, collectionName) as CollectionRelationModel

    setItemCheckSideEffects({
      item,
      collection,
      relationModel,
      value,
      isAltKeyPressed,
    })
  }
  return setItem

  function setItemCheckSideEffects ({
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
      collection.items
        .filter(i => i.id !== item.id)
        .forEach((i) => {
          i.checked = false
        })
    }
    // else if (
    //   isAltKeyPressed &&
    //   (
    //     relationModel.userSelection === 'leaves-only' ||
    //     relationModel.userSelection === 'all-nodes'
    //   )
    // ) {
    //   // nextTick(() => {
    //   // setItem({ collectionName: collection.collectionName, id: item.id, value: true })
    //   setItemSiblings({ collection, item, value: false })
    //   // nextTick(() => {
    //   //   // if (!item?.checked) {
    //   // item.checked = true
    //   // }
    //   // })
    //   // })
    // }
    else if (relationModel.userSelection === 'all-nodes') {
      setItemChildren({ collection, item, value, isAltKeyPressed })
      setItemParent({ collection, item, value, isAltKeyPressed })
    }
  }

  function setItemParent ({
    collection,
    item,
    value,
    isAltKeyPressed,
  }: CheckItemProps): void {
    const parent = collection.items
      .find(i => i.id === item.parent_id)

    const siblings = collection.items
      .filter(i => i.parent_id === item.parent_id)

    if (
      value === true &&
      parent &&
      parent.checked === false
    ) {
      parent.checked = true
      setItemParent({
        collection,
        item: parent,
        value,
        isAltKeyPressed,
      })
    }

    if (
      parent &&
      siblings?.length
    ) {
      const allSiblingsUnchecked = siblings
        .every(sibling => !sibling.checked)

      if (
        allSiblingsUnchecked &&
        parent.checked === true
      ) {
        setItem({
          collectionName: collection.collectionName,
          id: parent.id,
          value: false,
          isAltKeyPressed,
        })
      }
    }
  }

  function setItemChildren ({
    collection,
    item,
    value,
    isAltKeyPressed,
  }: CheckItemProps): void {
    const children = collection.items
      .filter(i => i.parent_id === item.id)

    children
      .forEach((child) => {
        setItem({
          collectionName: collection.collectionName,
          id: child.id,
          value,
          isAltKeyPressed,
        })
      })
  }

  function setItemSiblings ({
    collection,
    item,
    value,
  }: CheckItemProps): void {
    const parent = collection.items
      .find(i => i.id === item.parent_id)

    const siblings = collection.items
      .filter(i => (
        i.parent_id === item.parent_id &&
        i.id !== item.id
      ))

    siblings
      ?.forEach((sibling) => {
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
}
