type CheckItemProps = {
  collection: FiltersCollection,
  item: GpsFilterItemNode,
  value: boolean,
  avoid?: number[],
  isAltKeyPressed?: boolean,
}

/**
 * Set the checked value of a filter item,
 * and apply side effects based on the relation model
 */
export function useSetItem(
  postsCollectionName: Ref<string | null>,
  filtersCollections: Ref<FiltersCollection[]>,
) {
  const { getRelationModel } = useCollectionsModels()

  function setItem({
    collectionName,
    id,
    value,
    avoid = [],
    isAltKeyPressed,
  }: {
    collectionName: string,
    id: number,
    value: any,
    avoid?: number[],
    isAltKeyPressed?: boolean
  }) {
    const collection = filtersCollections.value
      .find(c => c.collectionName === collectionName)
    if (!collection) { return }

    const item = collection.items
      .find(i => i.id === id)
    if (!item) { return }

    item.checked = value

    if (avoid.includes(item.id)) { return } // avoid infinite loop when circular relations

    avoid.push(item.id)
    const relationModel = getRelationModel(postsCollectionName.value, collectionName)
    setItemCheckSideEffects({
      item,
      collection,
      relationModel,
      value,
      avoid,
      isAltKeyPressed,
    })
  }
  return setItem

  function setItemCheckSideEffects({
    collection,
    relationModel,
    isAltKeyPressed,
    item,
    avoid,
    value,
  }: {
    collection: FiltersCollection,
    relationModel: CollectionRelationModel | null,
    item: GpsFilterItemNode,
    value: boolean,
    avoid: number[],
    isAltKeyPressed?: boolean,
  }) {
    if (
      relationModel?.userSelection === 'single-node'
    ) {
      collection.items
        .filter(i => i.id !== item.id)
        .forEach((i) => {
          i.checked = false
        })
    }

    if (
      relationModel?.userSelection === 'leaves-only'
    ) {
      const parent = collection.items
        .find(i => i.id === item.parent_id)

      if (
        parent?.combination === 'unique'
      ) {
        const siblings = collection.items
          .filter((i) => {
            return (
              i.parent_id === parent.id &&
              i.id !== item.id
            )
          })

        siblings
          .forEach((i) => {
            i.checked = false
          })
      }
    }

    /**
     * @todo Fix this which is not working as expected
     * (We want siblings to get unchecked when alt key is pressed while checking a node)
     */
    // if (
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

    if (relationModel?.userSelection === 'all-nodes') {
      const props = {
        collection,
        avoid,
        item,
        value,
        isAltKeyPressed,
      }
      setItemChildren(props)
      setItemParent(props)
    }
  }

  function setItemParent({
    collection,
    item,
    value,
    isAltKeyPressed,
    avoid,
  }: CheckItemProps): void {
    const parent = collection.items
      .find(i => i.id === item.parent_id)

    if (
      !parent || (
        parent?.id &&
        avoid.includes(parent.id)
      )
    ) { return }

    const siblings = collection.items
      .filter((i) => {
        return (
          i.parent_id === item.parent_id &&
          i.id !== item.id
        )
      })

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
        avoid,
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
          avoid,
        })
      }
    }
  }

  function setItemChildren({
    collection,
    item,
    value,
    avoid,
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
          avoid,
          isAltKeyPressed,
        })
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setItemSiblings({
    collection,
    item,
    value,
    avoid,
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
        avoid,
      })
    }
  }
}
