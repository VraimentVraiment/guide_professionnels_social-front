export { }

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

  export interface PostStore <PostType extends Post> {
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

  export interface DispositifPost  extends Post {
    [key in richTextKeys]?: RichText
    type_dispositif: ManyToOneId
    images: OneToManyId[]
    criteres_dispositif: OneToManyId[]
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
  }

  export interface FilterItem {
    id: number
    name: string;
    checked: boolean;
    children: OneToManyId;
    collectionName: string;
    parent_id: ManyToOneId;
  }

  export interface RootFilterItem {
    id: 0
    name: string;
    parent_id: null;
  }

  export type FilterItemNode = FilterItem | RootFilterItem

  export type FiltersCollection = {
    name: string
    label: string
    items: FilterItem[]
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
