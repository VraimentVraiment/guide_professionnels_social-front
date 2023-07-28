import {
  type DirectusQueryParams,
} from 'nuxt-directus/dist/runtime/types'

import {
  type RouteLocationRaw
} from 'vue-router'

declare global {

  export type DirectusFileData = {
    id: number
    filesize: number
    type: string
  }

  export type DsfrNavigationMenuLinkProps = {
    text: string
    to: RouteLocationRaw
  };

  export type DsfrNavItem = DsfrNavigationMenuLinkProps | {
    title: string
    links: DsfrNavigationMenuLinkProps[]
  }

  export type GpsPage = {
    title: string,
    slug: string,
    status: PageStatus
    metatitle?: string
    metadescription?: string
    content?: string
  }

  export type GpsPagesGroup = {
    name: string;
    pages: GpsPage[];
  }

  export type GpsSiteNavMenu = {
    collection: 'gps_pages' | 'gps_pages_groups',
    item: GpsPage | {
      name: string,
      pages: GpsPage[]
    }
  }[]


  export type FetchDirectusItemsParams = {
    collectionName: string
    params?: DirectusQueryParams
  }

  export type FetchDirectusItemParams = {
    collectionName: string
    id: number
  }

  /*
   *
   * GPS14 Posts
   *
   */

  export type PostStatus = 'published' | 'draft' | 'archived'

  export type PageStatus = 'published-public' | 'published-private' | 'draft' | 'archived'

  export type RichTextKey = 'public_eligible' | 'cadre_de_vie' | 'missions' | 'demande_dinformation' | 'demarche_a_suivre'

  export interface Post {
    date_created: string
    date_updated: string
    id: number
    name: string
    slug: string
    sort: number | null
    status: PostStatus
    // addresses?: GpsAddress[]
  }

  export interface LocalizedPost extends Post {
    addresses?: GpsAddress[]
  }

  export interface DispositifPost extends LocalizedPost {
    [key: RichTextKey]: string
    caracteristiques_dispositif: number[][]
    type_dispositif: number
    images: number[][]
    important_file?: string
    important_file_title?: string
    important_file_description?: string
  }

  export interface FicheTechniquePost extends Post {
    media: string
    type_dispositif: number
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
    filterStatus?: PostStatus[]
  }

  export type CollectionRelationModel = {
    label: string
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
    children: number[];
    sort: number;
  }

  export interface FilterItemNode extends FilterItem {
    collectionName: string
    userSelection: UserSelection
    open?: boolean;
    checked?: boolean;
  }

  export type CollectionItem<PostType extends Post> = PostType | DirectusFilterItem | DirectusRelationItem

  export type PostsCollection<PostType extends Post> = {
    collectionName: string,
    label?: string
    items: PostType[]
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
   * Geocoding
   *
   */

  type GeoJsonPointFeature = {
    type: 'Feature'
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
    properties: {
      [key: string]: string | number | boolean
    }
  }

  /**
   * @see https://adresse.data.gouv.fr/api-doc/adresse
   */
  type GouvAddressApiPointProperties = {
    city: string
    citycode: string
    context: string
    id: string
    importance: number
    housenumber: string
    label: string
    name: string
    postcode: string
    score: number
    type: 'housenumber' | 'street' | 'locality' | 'municipality'
    street: string
    x: number
    y: number
    district?: string
    oldcitycode?: string
    oldcity?: string
  }

  type GouvAddressApiFeatureCollection = {
    type: "FeatureCollection",
    version: "draft",
    features: GouvAddressFeature[]
    attribution: "BAN",
    licence: "ODbL 1.0",
    query: string
    limit: number
  }

  type GouvAddressFeature = GeoJsonPointFeature & {
    properties: GouvAddressApiPointProperties
  }

  type GpsAddress = {
    address: {
      text: string
      value: GouvAddressFeature
    }
  }

  /**
   * @see https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MarkerOptions.html
   */
  type GpMarkerOptions = {
    position?: {
      x: number;
      y: number;
      projection?: string;
    };
    content: string;
    contentType?: string;
    url?: string; // Icon URL used to materialize the marker.
    offset?: [number, number];
    ppoffset?: [number, number];
    autoPanOptions?: {
      autoPan: boolean;
      duration: number;
      margin: number;
    }
  }

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

  export type Accessor<T, U> = (item: T) => U
}

export { }
