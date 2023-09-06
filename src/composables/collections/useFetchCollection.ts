import { type DirectusQueryParams } from 'nuxt-directus/dist/runtime/types'

/**
 * Return a function that will fetch a collection from Directus,
 * based on the collection type (posts, filters, relations).
 */
export function useFetchCollection<PostType extends GpsPost>(
  postsCollectionName: Ref<string | null>,
  collections: Ref<ItemsCollection[]>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
) {
  const {
    getRelationModel,
    getManyToManyRelationsModels,
    getCollectionModelByName,
    getFields,
  } = useCollectionsModels()

  async function fetchCollection(
    collectionName: string,
    params: DirectusQueryParams = {},
    collectionType?: CollectionType,
    relationModel?: CollectionRelationModel,
  ): Promise<void> {
    collectionType ??= getCollectionModelByName(collectionName)?.type
    if (!collectionType) {
      return
    }

    if (collectionType === 'taxonomy') {
      relationModel = getRelationModel(postsCollectionName.value, collectionName) as CollectionRelationModel
      if (!relationModel) {
        return
      }
    }

    const existingCollection = collections.value
      .find((c) => {
        return (
          c.type === collectionType &&
          c.collectionName === collectionName
        )
      })

    const directusFilter = getDirectusFilter(directusFilters, collectionName)

    const items = directusFilter === false
      ? []
      : (
        await useFetchDirectusItems<CollectionItem<PostType>>({
          collectionName,
          params: Object.assign(params, {
            filter: directusFilter,
            fields: getFields(collectionName),
          }),
        })
      )
        ?.map(getInitialItem<PostType>(collectionType, relationModel)) as ItemsCollection['items']

    if (!existingCollection) {
      collections.value.push(getInitialCollection<PostType>(collectionName, collectionType, items, relationModel))
    } else {
      const difference = useArrayDifference<ItemsCollection['items'][0]>(existingCollection.items, items, el => el.id)
      if (difference.hasChanges) {
        updateCollection(existingCollection, items, collectionType)
      }
    }

    await fetchRelationsCollections(collectionName)
  }

  async function fetchRelationsCollections(
    collectionName: string,
  ) {
    const relationsModels = getManyToManyRelationsModels(collectionName)
    if (
      !relationsModels?.length
    ) {
      return
    }
    await Promise.all(
      relationsModels
        .filter((relationModel) => {
          return (
            !collections.value
              .some((c) => {
                return (
                  c.type === 'relations' &&
                  c.collectionName === relationModel.relationCollectionName
                )
              })
          )
        })
        .map((relationModel) => {
          return fetchCollection(
            relationModel.relationCollectionName as string, {
              limit: -1,
            },
            'relations',
            relationModel,
          )
        }),
    )
  }

  return fetchCollection
}

function getInitialItem<PostType extends GpsPost>(
  type: CollectionType,
  relationModel?: CollectionRelationModel,
): (d: CollectionItem<PostType>) => ItemsCollection['items'][0] {
  switch (type) {
    case 'posts':
      return item => item as unknown as GpsPost
    case 'relations':
      return item => item as unknown as DirectusRelationItem
    case 'taxonomy':
      return item => getInitialFilterItemNode(item as DirectusFilterItem, relationModel as CollectionRelationModel)
  }
}

function getInitialCollection<PostType extends GpsPost>(
  collectionName: string,
  type: CollectionType,
  items: ItemsCollection['items'],
  relationModel?: CollectionRelationModel,
): ItemsCollection {
  switch (type) {
    case 'posts':
      return {
        collectionName,
        type: 'posts',
        items,
      } as PostsCollection<PostType>

    case 'relations':
      return {
        type: 'relations',
        relationModel,
        collectionName,
        items,
        // groupedItems : groupRelationsItems(items as DirectusRelationItem[], relationModel),
      } as RelationsCollection

    case 'taxonomy':
      return {
        collectionName,
        label: (relationModel as CollectionRelationModel).label,
        type: 'taxonomy',
        items,
      } as FiltersCollection
  }
}

export function updateCollection(
  collection: ItemsCollection,
  items: ItemsCollection['items'],
  type: 'taxonomy' | 'posts' | 'relations',
): void {
  switch (type) {
    case 'taxonomy': {
      const existingItemsChecked = (collection.items as GpsFilterItemNode[])
        .filter(item => item.checked)
        .map(item => item.id)

      collection.items = items

      for (const item of collection.items as GpsFilterItemNode[]) {
        if (
          (existingItemsChecked as number[]).includes(item.id) &&
          !item.checked
        ) {
          item.checked = true
        }
      }

      break
    }
    case 'posts':
    case 'relations': {
      collection.items = items
      break
    }
  }
}
