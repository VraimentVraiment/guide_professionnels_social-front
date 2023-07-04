<script setup lang="ts">

definePageMeta({
  layout: 'default',
  middleware: [
    'collections-models',
  ],
})

const {
  richTextFields,
  defaultFilename,
  buttonsLabels,
} = await useGetContent('/dispositif')

/**
 * @todo Use signal error modal when directus fix this :
 * - Not able to send notification to everyone assigned to a role,
 *   which should be working according to this official tutorial :
 *   @see https://learndirectus.com/how-to-send-a-notification/
 * - Notification not opening in backend UI
 */
const doUseSignalModal = false

const id = parseInt(useRoute().params.id as string, 10)

const {
  post,
  files: images,
} = await useFetchDirectusSinglePostItem<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  id,
  filesCollectionName: 'gps_fichesdispositif_directus_files',
  filesField: 'images',
})

if (!post) {
  navigateTo('/404')
}

const print = () => {
  window.print()
}

const {
  download,
  isGeneratingDownload,
} = await useGpsPostDownload('.gps-post__content', {
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
        {'download' : isGeneratingDownload},
        'fr-col-12',
        {'fr-col-sm-8' : !isGeneratingDownload}
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
          <span
            class="fr-icon-road-map-fill"
            aria-hidden="true"
          />
          <ul>
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
          <RichText
            v-if="post?.[key]"
            :field-key="key"
            :field-label="label"
            :content="post[key]"
          />
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
            v-for="{ directus_files_id } in images"
            :key="directus_files_id"
            :src="getDirectusFile(directus_files_id)"
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
        {'download' : isGeneratingDownload}
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
        <GpsSignalModal
          v-if="doUseSignalModal"
        />
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
      padding: 3rem;
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
