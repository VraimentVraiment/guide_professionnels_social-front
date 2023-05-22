import {
  type HierarchyNode,
} from 'd3-hierarchy'

import {
  /* auth */
  DirectusUser,
  DirectusAuthCredentials,
  DirectusAuthResponse,
  DirectusPasswordForgotCredentials,
  DirectusPasswordResetCredentials,
  DirectusUserRequest,
  DirectusUserCreation,
  DirectusUserUpdate,
  DirectusUserDeletion,
  DirectusRegisterCredentials,
  /* query params */
  DirectusQueryParams,
  /* collections */
  DirectusCollectionRequest,
  DirectusCollectionMeta,
  DirectusCollectionCreation,
  DirectusCollectionUpdate,
  /* items */
  DirectusItemMetadata,
  DirectusItems,
  DirectusItem,
  DirectusItemRequest,
  DirectusItemCreation,
  DirectusItemUpdate,
  DirectusItemDeletion,
  /* files */
  DirectusFile,
  DirectusFolders,
  DirectusFileRequest,
  DirectusThumbnailFormat,
  DirectusThumbnailFit,
  DirectusThumbnailOptions,
  /* notification */
  DirectusNotificationObject,
  /* revisions */
  DirectusRevision,
} from "nuxt-directus/dist/runtime/types";

export {
    /* auth */
    DirectusUser,
    DirectusAuthCredentials,
    DirectusAuthResponse,
    DirectusPasswordForgotCredentials,
    DirectusPasswordResetCredentials,
    DirectusUserRequest,
    DirectusUserCreation,
    DirectusUserUpdate,
    DirectusUserDeletion,
    DirectusRegisterCredentials,
    /* query params */
    DirectusQueryParams,
    /* collections */
    DirectusCollectionRequest,
    DirectusCollectionMeta,
    DirectusCollectionCreation,
    DirectusCollectionUpdate,
    /* items */
    DirectusItemMetadata,
    DirectusItems,
    DirectusItem,
    DirectusItemRequest,
    DirectusItemCreation,
    DirectusItemUpdate,
    DirectusItemDeletion,
    /* files */
    DirectusFile,
    DirectusFolders,
    DirectusFileRequest,
    DirectusThumbnailFormat,
    DirectusThumbnailFit,
    DirectusThumbnailOptions,
    /* notification */
    DirectusNotificationObject,
    /* revisions */
    DirectusRevision,
}

declare global {
  /*
   *
   * Fields
   *
   */

  export type Address = {
    adress: {
      text: string
      value: {
        lat: number
        lng: number
      }
    }
  }

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

  export interface Post {
    date_created: string
    date_updated: string
    id: number
    name: string
    slug: string
    sort: number | null
    status: PostStatus
  }

  export interface PostStore<PostType extends Post> {
    collection: Ref<PostType[]>
    update: (filters?: FiltersCollection[]) => Promise<void>
  }

  /*
   *
   * GPS14 Posts
   *
   */

  export type RichTextKey = 'public_eligible' | 'cadre_de_vie' | 'missions' | 'demande_dinformation' | 'demarche_a_suivre'

  export interface FicheTechniquePost extends Post {
    media: ManyToOneUuid
    type_dispositif: ManyToOneId
  }

  export interface DispositifPost extends Post {
    [key in richTextKeys]?: RichText
    type_dispositif: ManyToOneId
    images: OneToManyId[]
    caracteristiques_dispositif: OneToManyId[]
    addresses: address[]
  }

  /*
   *
   * Filters
   *
   */

  export type DirectusFilter = Record<string, Record<string, string | DirectusFilter>>;

  export interface DirectusFilterItem {
    id: number
    name: string;
    children: OneToManyId;
    parent_id: ManyToOneId;
    slug: string;
    sort: number;
    combination?: 'and' | 'or' | 'unique'
  }

  export interface FilterItemNode {
    id: number;
    name: string;
    collection: FiltersCollection;
    checked?: boolean;
    // children?: OneToManyId;
    parent_id: number | null;
    checked?: boolean;
    open?: boolean;
    combination?: 'and' | 'or' | 'unique'
  }

  type Junction = {
    items: Record<string, number>[],
    primaryKey: string,
    sourceKey: string,
    targetKey: string,
    targetCollectionName: string,
    // joinCollectionName?: string,
  }

  export type FiltersCollection = {
    name: string
    items: FilterItemNode[]
    label?: string
    relationType?: 'many-to-many' | 'many-to-one' | 'one-to-many'
    userSelection?: 'leaves-only' | 'all-nodes' | 'single-node'
    foreignKey?: string
    fieldName?: string
    rootNode?: RootFilterItemNode
    foreignKey?: string
    joinCollectionName?: string
    primaryKey?: string
    sourceKey?: string
    targetKey?: string
    targetCollectionName?: string
  }

  export interface FilterStore {
    collections: FiltersCollection[],
    fetchAll: () => Promise<void>,
  }

  /*
   *
   * Auth
   *
   */

  export type InfoMessageTypes = 'error' | 'success' | 'info'

  export type InfoMessageModel = {
    display: Ref<boolean>
    props: Ref<{
      type?: InfoMessageTypes
      title?: string
      description?: string
    }>,
    show: (type: InfoMessageTypes) => void
    reset: () => void
  }

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
    infoMessage: {

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
    infoMessage: InfoMessageModel
    isError: Ref<boolean>
    submit(): void
  }

  /*
   *
   * Misc
   *
   */

  export type RecursiveYmlContent = Record<string, string | string[] | RecursiveYmlContent>

  export type Accessor<T> = (item: T) => string | undefined | null
}
