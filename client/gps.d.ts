declare global {

  export type DirectusItem = DirectusItem
  /*
   *
   * Fields
   *
   */
  export type ManyToOneId = number
  export type OneToManyId = number[]
  export type RichText = string
  export type ManyToOneUuid = string

  /*
   *
   * GPS14 Posts
   *
   */

  export type PostStatus = 'published' | 'draft' | 'archived'
  export type RichTextKey = 'public_eligible' | 'cadre_de_vie' | 'missions' | 'demande_dinformation' | 'demarche_a_suivre'

  export interface Post {
    date_created: string
    date_updated: string
    id: number
    name: string
    slug: string
    sort: number | null
    status: PostStatus
  }

  export interface FicheTechniquePost extends Post {
    media: ManyToOneUuid
    type_dispositif: ManyToOneId
  }

  export interface DispositifPost extends Post {
    [key in richTextKeys]?: RichText
    images: OneToManyId[]
    caracteristiques_dispositif: OneToManyId[]
    type_dispositif: ManyToOneId
    addresses: address[]
    important_file?: string
    important_file_title?: string
    important_file_description?: string
  }

  /*
   *
   * Filters
   *
   */
  export type CollectionType = 'posts' | 'taxonomy' | 'relations'
  export type RelationType = 'many-to-one' | 'many-to-many'
  export type UserSelection = 'leaves-only' | 'all-nodes' | 'single-node'
  export type FilterCombination = 'and' | 'or' | 'unique'

  export type CollectionModel = {
    label: string
    collectionName: string
    type: CollectionType
    relations?: CollectionRelationModel[]
    fields?: string[]
    filesCollectionName?: string
    filesField?: string
  }

  export type CollectionRelationModel = {
    label: string
    // collectionName: string
    relationType: RelationType
    userSelection?: UserSelection
    field?: string
    sourceCollectionName: string
    targetCollectionName: string
    relationCollectionName?: string
    sourceKey?: string
    targetKey?: string
  }
  export type DirectusRelationItem = {
    id: number
    [key: string]: number
  }

  export type DirectusFilter = Record<string, Record<string, unkown>>

  export type CollectionDirectusFilter = {
    collectionName: string,
    filter: DirectusFilter
  }

  export type FilterItem = {
    id: number
    name: string
    parent_id: number | null
    combination?: FilterCombination
    pictogramme?: string
  }

  export interface DirectusFilterItem extends FilterItem {
    children: OneToManyId;
    sort: number;
  }

  export interface FilterItemNode extends FilterItem {
    collectionName: string
    userSelection: UserSelection
    open?: boolean;
    checked?: boolean;
  }

  export type CollectionItem = Post | DirectusFilterItem | DirectusRelationItem

  export type PostsCollection = {
    collectionName: string,
    label?: string
    items: Post[]
    type: 'posts'
  }

  export type FiltersCollection = {
    collectionName: string;
    label?: string
    items: FilterItemNode[]
    type?: 'taxonomy'
  }

  export type RelationsCollection = {
    collectionName: string,
    items: DirectusRelationItem[]
    relationModel: CollectionRelationModel
    type: 'relations'
  }

  export type ItemsCollection = PostsCollection | FiltersCollection | RelationsCollection

  export type RelationGroups = {
    targetKey: string;
    sourceKey: string;
    groups: Record<string, number | number[]>[];
  }[]
  /*
   *
   * Auth
   *
   */
  export type FieldModel = {
    value: Ref<string>
    isError: Ref<boolean>
    isValid: Ref<boolean>
    props: {
      label?: string
      placeholder?: string
      hint?: string
      autocomplete?: string
    }
    errorMessage: ComputedRef<string | undefined>
    validMessage: ComputedRef<string | undefined>
    validate: () => void
    reset: () => void
  }

  /*
   *
   * Misc
   *
   */

  export type RecursiveYmlContent = Record<string, string | string[] | RecursiveYmlContent>

  export type Accessor<T, U> = (item: T) => U
}

export { }
