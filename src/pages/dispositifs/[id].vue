<script setup lang="ts">

const content = await queryContent('/pages/dispositif').findOne() as unknown as {
  downloadFilesLabel: string
  defaultFilename: string
  lastUpdateLabel: string
  buttonsLabels: {
    download: string
    print: string
  }
}

const { getCollectionModelByName } = useModelsStore()
const model = getCollectionModelByName('gps_fichesdispositif')

const id = parseInt(useRoute().params.id as string, 10)
const post = await useFetchDirectusItem<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  id,
})
if (post === null) {
  navigateTo('/404')
}
useHead({
  title: post?.name,
})

const { data: imagesData } = useAsyncData(() => {
  return useFetchDirectusItemRelatedFiles<DispositifPost>({
    collectionName: 'gps_fichesdispositif',
    item: post as DispositifPost,
    field: 'images',
  })
})

const { data: importantFilesData } = useAsyncData(() => {
  return useFetchDirectusItemRelatedFiles<DispositifPost>({
    collectionName: 'gps_fichesdispositif',
    item: post as DispositifPost,
    field: 'download_file',
    getMeta: ['type', 'filesize'],
  })
})

const {
  download,
  isGeneratingDownload,
} = await useHtml2pdf('.gps-post__content', {
  avoid: '.gps-rich-text-container',
})

const downloadPost = () => {
  useWithLightScheme(() => download(post?.name ?? content.defaultFilename))
}

const printPost = () => {
  useWithLightScheme(window.print)
}

const notificationMessagePrefix = `[${useDirectusUser().value?.email}, "${post?.name}"]`

</script>

<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
    ]"
  >
    <section
      :class="[
        'gps-post__content',
        { 'download': isGeneratingDownload },
        'fr-col-12',
        { 'fr-col-sm-8': !isGeneratingDownload }
      ]"
    >
      <header>
        <h1>
          {{ post?.name }}
        </h1>
        <p
          v-if="post?.date_updated?.length"
          :class="[
            'fr-text--sm',
            'gps-date'
          ]"
        >
          {{ content.lastUpdateLabel }}
          {{ getLocaleDate(post.date_updated) }}
        </p>
        <hr
          :class="[
            'fr-hr'
          ]"
        >
        <template v-if="post?.addresses?.length">
          <v-icon
            name="ri-road-map-fill"
            aria-hidden="true"
          />
          <ul
            :class="[
              'addresses-list'
            ]"
          >
            <li
              v-for="address, i in post.addresses"
              :key="i"
            >
              {{ address.address.text }}
            </li>
          </ul>
        </template>
      </header>
      <article
        :class="[
          'fr-mt-12v'
        ]"
      >
        <template
          v-for="{ key, label } in model?.richTextFields"
          :key="key"
        >
          <div
            v-if="post?.[key as keyof DispositifPost]"
            :class="[
              'gps-rich-text-container'
            ]"
          >
            <h2>{{ label }}</h2>
            <div
              :class="[
                'gps-rich-text',
                `gps-rich-text__${key}`
              ]"
            >
              <div v-dompurify-html="post[key as keyof DispositifPost] ?? ''" />
            </div>
          </div>
          <hr
            v-if="post?.[key as keyof DispositifPost]"
            :class="[
              'fr-hr',
              'noprint'
            ]"
          >
        </template>
        <div
          v-if="post?.images?.length"
          :class="[
            'gps-post__images'
          ]"
        >
          <img
            v-for="{ id: imgId } in imagesData"
            :key="imgId"
            :src="useGetDirectusFileLink(imgId) ?? ''"
            alt=""
          >
        </div>
      </article>
    </section>
    <section
      :class="[
        'gps-post__actions',
        'noprint',
        'fr-col-12',
        { 'fr-col-sm-3': !isGeneratingDownload },
        { 'fr-col-offset-sm-1': !isGeneratingDownload },
        { 'download': isGeneratingDownload }
      ]"
    >
      <div>
        <DsfrButton
          :label="content.buttonsLabels.download"
          secondary
          icon="ri-file-download-line"
          icon-right
          @click="() => downloadPost()"
        />
        <DsfrButton
          class="fr-mt-4v"
          :label="content.buttonsLabels.print"
          icon="ri-printer-line"
          icon-right
          secondary
          @click="() => printPost()"
        />
        <GpsSignalModal
          :get-message-content="(content: string) => `${notificationMessagePrefix} : ${content}`"
        />

        <h3
          v-if="importantFilesData?.length"
          class="fr-mt-8v fr-mb-4v"
        >
          {{ content.downloadFilesLabel }}
        </h3>
        <div class="important-files">
          <DsfrFileDownload
            v-for="{ id: fileId, file, meta } in importantFilesData"
            :key="fileId"
            class="fr-mt-8v"
            :block="meta?.block"
            :title="meta?.title"
            :description="meta?.description"
            :format="formatFileFormat(file?.type as string)"
            :size="formatBytes(file?.filesize as number)"
            :href="useGetDirectusFileLink(fileId, { download: true }) ?? ''"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
section.gps-post__content {
  @media print {
    padding: 3rem;
  }

  header,
  article {
    background: var(--background-default-grey);

    @media screen {
      padding: 1.5rem;

      @include dsfr.sm {
        padding: 2rem;
      }

      @include dsfr.md {
        padding: 3rem;
      }
    }
  }

  article {
    .gps-post__images {
      img {
        width: 100%;
      }
    }
  }
}

section.gps-post__content.download {
  header,
  article {
    background: none;
    padding: 0 2rem;
  }
}

section.gps-post__actions {
  &.download {
    display: none !important;
  }

  >div {
    position: sticky;
    top: 4rem;
  }

  button {
    width: 100%;
    justify-content: center;
  }
}

ul.addresses-list {
  list-style: none;
  padding: 0;
}

.fr-hr {
  max-width: 160px;

  @media screen {
    padding-bottom: 2rem;
    margin-top: 2rem;
  }

  @media print {
    padding-bottom: 1rem;
    margin-top: 1rem;
  }

  &:last-child {
    display: none;
  }
}
</style>
