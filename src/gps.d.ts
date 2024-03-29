import { type RouteLocationRaw } from 'vue-router'

import { type HierarchyNode } from 'd3-hierarchy'

import {
  DsfrNavigationMenuLink,
  DsfrNavigation,
  DsfrNavigationMenu,
  DsfrHeader,
  DsfrTabs,
  DsfrButton,
  DsfrButtonGroup,
  DsfrCards,
  DsfrFileDownload
} from '@gouvminint/vue-dsfr'

declare global {

  /*
   * Utils
   */

  export type ArrayItemType<T> = T extends (infer U)[] ? U : never;

  export type Accessor<T, U> = (item: T) => U

  export type ComponentProps<T extends { new (...args: any[]): { $props: any } }> = InstanceType<T>['$props'];

  /*
   * DSFR
   */

  export type DsfrNavigationMenuLinkProps = ComponentProps<typeof DsfrNavigationMenuLink>

  export type DsfrNavigationMenuProps = ComponentProps<typeof DsfrNavigationMenu>

  export type DsfrNavigationProps = ComponentProps<typeof DsfrNavigation>
  export type DsfrNavItem = ArrayItemType<DsfrNavigationProps['navItems']>

  export type DsfrHeaderProps = ComponentProps<typeof DsfrHeader>
  export type DsfrQuicklink = ArrayItemType<DsfrHeaderProps['quickLinks']>

  export type DsfrButtonGroupProps = ComponentProps<typeof DsfrButtonGroup>
  export type DsfrButtonsProps = ArrayItemType<DsfrButtonGroupProps['buttons']>

  export type DsfrTabsProps = ComponentProps<typeof DsfrTabs>
  export type DsfrTabTitle = ArrayItemType<DsfrTabsProps['tabTitles']>

  export type DsfrCardProps = ComponentProps<typeof DsfrCards>
  export type DsfrFileDownloadProps = ComponentProps<typeof DsfrFileDownload>


  /*
   * GPS Pages
   */

  export type GpsPage = {
    id: number,
    title: string,
    slug: string,
    status: GpsPageStatus
    metatitle?: string
    metadescription?: string
    content?: string
  }

  export type GpsPagesGroup = {
    name: string;
    pages: GpsPage[];
  }

  export type GpsQuickLink = DsfrQuicklink & {
    public?: boolean
  }

  export type GpsPageStatus = 'published-public' | 'published-private' | 'draft' | 'archived'

  export type GpsPostStatus = 'published' | 'draft' | 'archived'

  export interface GpsPost {
    id: number
    date_created: string
    date_updated: string
    name: string
    slug: string
    sort: number | null
    status: GpsPostStatus
  }

  export interface GpsLocalizedPost extends GpsPost {
    addresses?: GpsAddress[]
  }

  export interface DispositifPost extends GpsLocalizedPost {
    [key: string]: string
    thematique: number[]
    type_dispositif: number
    caracteristiques_dispositif: number[]
    images: number[]
    download_files: number[]
  }

  export interface FicheTechniquePost extends GpsPost {
    media: string
    thematique: number[]
    type_dispositif: number
  }

  /*
   * Gps collection models
   */

  export type CollectionType = 'posts' | 'taxonomy' | 'relations'

  export type RelationType = 'many-to-one' | 'many-to-many'

  export type UserSelection = 'leaves-only' | 'all-nodes' | 'single-node'

  export type FilterCombination = 'and' | 'or' | 'unique'

  export type RelatedFilesModelType = 'files' | 'file' | 'many-to-many'

  export type CollectionModel = {
    label: string
    collectionName: string
    type: CollectionType
    relations?: CollectionRelationModel[]
    thumbnailFields?: string[]
    relatedFiles: CollectionRelatedFilesModel[]
    limit?: number
    filterStatus?: GpsPostStatus[]
    richTextFields?: {
      label: string
      key: string
    }[]
  }

  export type CollectionRelationModel = {
    label: string
    relationType: RelationType
    mandatory?: boolean
    userSelection?: UserSelection
    field?: string
    sourceCollectionName: string
    targetCollectionName: string
    relationCollectionName?: string
    sourceKey?: string
    targetKey?: string
    order?: number
  }

  export type CollectionRelatedFilesModel = {
    type: RelatedFilesModelType
    field: string
    relationCollectionName: string
    targetKey: string
    sourceKey?: string
    targetCollectionName?: string
    metaFields?: string[]
    fileIdField?: string
  }

  /*
   * Gps collections
   */

  export type GpsFilterItem = {
    id: number
    name: string
    parent_id: number | null
    combination?: FilterCombination
    pictogramme?: string
  }

  export interface DirectusFilterItem extends GpsFilterItem {
    children: number[];
    sort: number;
  }

  export interface GpsFilterItemNode extends GpsFilterItem {
    collectionName: string
    userSelection: UserSelection
    open?: boolean;
    checked?: boolean;
  }

  export type GpsFilterNodeProps = {
    node: HierarchyNode<GpsFilterItemNode> | null
    postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
    isRootNode?: boolean
    dataCombination?: 'and' | 'or' | 'unique'
    parentName?: string
  }

  export type DirectusRelationItem = {
    id: number
    [key: string]: number
  }

  export type CollectionItem<PostType extends GpsPost> = PostType | DirectusFilterItem | DirectusRelationItem

  export type PostsCollection<PostType extends GpsPost> = {
    collectionName: string,
    label?: string
    items: PostType[]
    type: 'posts'
    itemsCount?: number
  }

  export type FiltersCollection = {
    collectionName: string;
    label?: string
    items: GpsFilterItemNode[]
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

  export type CollectionDirectusFilter = {
    collectionName: string,
    filter: Record<string, Record<string, unkown>>
  }

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

}

export { }
