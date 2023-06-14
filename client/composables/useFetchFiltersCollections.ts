export function useFetchFiltersCollections(
  filtersCollections: Ref<FiltersCollection[]>,
  collectionModel: Ref<CollectionModel | null>,
) {
  async function fetchFilterCollections(): Promise<void> {
    filtersCollections.value = await Promise.all(
      getFiltersCollections(collectionModel.value),
    )
  }
  return fetchFilterCollections;
}

function getFiltersCollections(
  collectionModel: CollectionModel | null,
): Promise<FiltersCollection>[] {

  return collectionModel?.relations
    ?.map(getInitialFilterCollection) ?? []
}

async function getInitialFilterCollection(
  relationModel: CollectionRelationModel,
): Promise<FiltersCollection> {
  const items = await useFetchDirectusItems<DirectusFilterItem>({
    collectionName: relationModel.collectionName,
  })
  return {
    ...relationModel,
    items: items.map(directusFilterItemToFilterItemNode),
  }

  function directusFilterItemToFilterItemNode(
    item: DirectusFilterItem,
  ): FilterItemNode {
    return {
      ...item,
      checked: false,
      relationModel,
    }
  }
}
