import {
  type HierarchyNode,
} from 'd3-hierarchy'

import {
  /* auth */
  type DirectusUser,
  type DirectusAuthCredentials,
  type DirectusAuthResponse,
  type DirectusPasswordForgotCredentials,
  type DirectusPasswordResetCredentials,
  type DirectusUserRequest,
  type DirectusUserCreation,
  type DirectusUserUpdate,
  type DirectusUserDeletion,
  type DirectusRegisterCredentials,
  /* query params */
  type DirectusQueryParams,
  /* collections */
  type DirectusCollectionRequest,
  type DirectusCollectionMeta,
  type DirectusCollectionCreation,
  type DirectusCollectionUpdate,
  /* items */
  type DirectusItemMetadata,
  type DirectusItems,
  type DirectusItem,
  type DirectusItemRequest,
  type DirectusItemCreation,
  type DirectusItemUpdate,
  type DirectusItemDeletion,
  /* files */
  type DirectusFile,
  type DirectusFolders,
  type DirectusFileRequest,
  type DirectusThumbnailFormat,
  type DirectusThumbnailFit,
  type DirectusThumbnailOptions,
  /* notification */
  type DirectusNotificationObject,
  /* revisions */
  type DirectusRevision,
} from "nuxt-directus/dist/runtime/types";

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
    type: 'taxonomy'
  }

  export type RelationsCollection = {
    collectionName: string,
    items: DirectusRelationItem[]
    relationModel: CollectionRelationModel
    type: 'relations'
  }

  export type ItemsCollection = PostsCollection | FiltersCollection | RelationsCollection

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

  export type GpsLoginStrings = {
    fieldSet: {
      legend: string
      hint: string
    }
    emailField: {
      label: string
      placeholder: string
      hint: string
      autocomplete: string
      messages: {
        error: string
        valid: string
      }
    }
    passwordField: {
      label: string
      placeholder: string
      hint: string
      autocomplete: string
      messages: {
        error: string
        valid: string
      }
    }
    loginButton: {
      label: string
    }
    messages: {
      error: {
        title: string
        description: string
      }
      success: {
        title: string
        description: string
      }
      info: {
        title: string
        description: string
      }
    }
  }

  export type GpsLogin = {
    fieldSet: {
      legend: string
      hint: string
    }
    email: FieldModel
    password: FieldModel
    button: {
      label: string
      disabled: ComputedRef<boolean>
    }
    alertModel: InfoMessageModel
    isError: Ref<boolean>
    submit(): void
  }

  /*
   *
   * Misc
   *
   */

  export type RecursiveYmlContent = Record<string, string | string[] | RecursiveYmlContent>

  export type Accessor<T, U> = (item: T) => U
}
