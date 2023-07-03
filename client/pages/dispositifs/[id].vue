<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const html2pdf = process.client && await import('html2pdf.js')

const id = parseInt(useRoute().params.id as string, 10)

const post = await useFetchDirectusItem<DispositifPost>({
  collectionName: 'gps_fichesdispositif',
  id,
})

const images = await useFetchDirectusItems<{
  directus_files_id: string,
}>({
  collectionName: 'gps_fichesdispositif_directus_files',
  params: {
    filter: {
      id: {
        _in: post?.images,
      },
    },
  },
})

if (!post) {
  navigateTo('/404')
}

const { richTextFields }: {
  key: RichTextKey,
  label: string,
}[] = await useGetContent('/dispositif')

const isDownload = ref(false)

function download (post) {
  const printOptions = {
    margin: [15, 5],
    filename: post.name + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true },
    pagebreak: { avoid: '.gps-rich-text-container' },
  }

  const content = document.querySelector('.gps-post__content')
  isDownload.value = true
  html2pdf.default(content, printOptions)
    .then(function () {
      isDownload.value = false
    })
}

const print = () => {
  window.print()
}

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
        {'download' : isDownload},
        'fr-col-12',
        {'fr-col-sm-8' : !isDownload}
      ]"
    >
      <header>
        <h1>
          {{ post?.name }}
        </h1>
        <DateUpdated
          v-if="post?.date_updated.length"
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
        { 'fr-col-sm-3': !isDownload },
        { 'fr-col-offset-sm-1': !isDownload },
        {'download' : isDownload}
      ]"
    >
      <div>
        <DsfrButton
          :label="'Télécharger'"
          secondary
          icon="ri-file-download-line"
          icon-right
          @click="() => download(post)"
        />
        <DsfrButton
          class="fr-mt-4v"
          :label="'Imprimer'"
          icon="ri-printer-line"
          icon-right
          secondary
          @click="() => print()"
        />
        <DsfrButton
          class="fr-mt-8v"
          icon="ri-alarm-warning-line"
          icon-right
          :label="'Signaler une modification ou une erreur'"
          secondary
          @click="() => console.log('Signaler une modification ou une erreur')"
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
