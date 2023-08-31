<script setup lang="ts">

definePageMeta({
  layout: 'default',
  middleware: [
    'collections-models',
  ],
})

const importantFilesLabel = 'Fichiers liés'

const {
  richTextFields,
  defaultFilename,
  buttonsLabels,
} = await queryContent('/dispositif').findOne() as unknown as {
  richTextFields: {
    key: keyof DispositifPost
    label: string
  }[]
  defaultFilename: string
  buttonsLabels: {
    download: string
    print: string
  }
}

/**
 * @todo Use signal error modal when directus fix this :
 * - Not being able to send notification to everyone assigned to a role,
 *   which should be working according to this tutorial :
 *   @see https://learndirectus.com/how-to-send-a-notification/
 * - Notification not opening in backend UI
 */
const doUseSignalModal = false

const id = parseInt(useRoute().params.id as string, 10)

const post = await useFetchDirectusItem<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  id,
})

if (post === null) {
  navigateTo('/404')
}

const imagesData = await useFetchDirectusItemRelatedFiles<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  item: post as DispositifPost,
  field: 'images',
})

const importantFilesData = await useFetchDirectusItemRelatedFiles<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  item: post as DispositifPost,
  field: 'important_file',
  getMeta: ['type', 'filesize'],
})

const print = () => {
  window.print()
}

const {
  download,
  isGeneratingDownload,
} = await useHtml2pdf('.gps-post__content', {
  avoid: '.gps-rich-text-container',
})

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
        <DateUpdated
          v-if="post?.date_updated?.length"
          :date-updated="post.date_updated"
        />
        <hr class="fr-hr">
        <template v-if="post?.addresses?.length">
          <v-icon
            name="ri-road-map-fill"
            aria-hidden="true"
          />
          <ul class="addresses-list">
            <li
              v-for="address, i in post.addresses"
              :key="i"
            >
              {{ address.address.text }}
            </li>
          </ul>
        </template>
      </header>
      <article>
        <template
          v-for="{ key, label } in richTextFields"
          :key="key"
        >
          <div
            v-if="post?.[key]"
            :class="`gps-rich-text-container`"
          >
            <h2>{{ label }}</h2>
            <div
              class="gps-rich-text"
              :class="[
                'gps-rich-text',
                `gps-rich-text__${key}`
              ]"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="post[key]" />
            </div>
          </div>
          <hr
            v-if="post?.[key]"
            class="fr-hr noprint"
          >
        </template>
        <div
          v-if="post?.images?.length"
          class="gps-post__images"
        >
          <img
            v-for="{ id: imgId } in imagesData"
            :key="imgId"
            :src="useGetDirectusFileLink(imgId)"
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
          :label="buttonsLabels.download"
          secondary
          icon="ri-file-download-line"
          icon-right
          @click="() => download(post?.name ?? defaultFilename)"
        />
        <DsfrButton
          class="fr-mt-4v"
          :label="buttonsLabels.print"
          icon="ri-printer-line"
          icon-right
          secondary
          @click="() => print()"
        />
        <h3
          v-if="importantFilesData?.length"
          class="fr-mt-8v fr-mb-0"
        >
          {{ importantFilesLabel }}
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
            :href="`${useGetDirectusFileLink(fileId, { download: true })}`"
          />
        </div>

        <GpsSignalModal v-if="doUseSignalModal" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/';

section.gps-post__content {
  @media print {
    padding: 3rem;
  }

  header,
  article {
    background: var(--background-default-grey);

    @media screen {
      padding: 1.5rem;

      @include sm {
        padding: 2rem;
      }

      @include md {
        padding: 3rem;
      }
    }
  }

  article {
    margin-top: 3rem;

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

// .important-files {
//   max-height: 60vh;
//   overflow-y: auto;
// }
</style>
