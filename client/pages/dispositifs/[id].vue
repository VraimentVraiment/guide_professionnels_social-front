<script setup lang="ts">

// import { type DirectusFile } from "nuxt-directus/dist/runtime/types";

definePageMeta({
  layout: 'dispositif',
})

const id = parseInt(
  useRoute().params.id as string,
  10)

const dispositif = await useFetchDirectusItem<DispositifPost>({
  collectionName: 'fiches_dispositif',
  id,
})

const images = (await useFetchDirectusItems<DispositifImage>({
  collectionName: 'fiches_dispositif_files',
  filter: {
    id: {
      _in: dispositif?.images,
    },
  },
}))

if (!dispositif) {
  navigateTo('/404')
}

const richTextFields = inject('richTextFields')

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
        'fr-col-8',
        'gps-post__content'
      ]"
    >
      <header>
        <GpsHead
          :page-content="{
            title: dispositif?.name,
            metaTitle: dispositif?.name,
          }"
        />
        <DateUpdated
          v-if="dispositif?.date_updated.length"
          :date-updated="dispositif.date_updated"
        />
        <hr class="fr-hr">
        <template v-if="dispositif?.addresses?.length">
          <span
            class="fr-icon-road-map-fill"
            aria-hidden="true"
          />
          <ul>
            <li
              v-for="address in dispositif.addresses"
              :key="address.id"
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
          <RichTextContainer
            v-if="dispositif?.[key]"
            :field-key="key"
            :field-label="label"
            :content="dispositif[key]"
          />
          <hr
            v-if="dispositif?.[key]"
            class="fr-hr"
          >
        </template>
        <div
          v-if="dispositif?.images?.length"
          class="gps-post__images"
        >
          <img
            v-for="{ directus_files_id }, i in images"
            :key="i"
            :src="`${useRuntimeConfig().directus.url}/assets/${directus_files_id}`"
            alt=""
          >
        </div>
      </article>
    </section>
    <section
      :class="[
        'gps-post-actions',
        'fr-col-3',
        'fr-col-offset-1',
      ]"
    >
      <div>
        <DsfrButton
          :label="'Télécharger'"
          secondary
          icon="ri-file-download-line"
          icon-right
          @click="() => console.log('download')"
        />
        <DsfrButton
          class="fr-mt-4v"
          :label="'Imprimer'"
          icon="ri-printer-line"
          icon-right
          secondary
          @click="() => console.log('print')"
        />
        <DsfrButton
          class="fr-mt-4v"
          :label="'Partager'"
          icon="ri-external-link-line"
          icon-right
          secondary
          @click="() => console.log('share')"
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

  header,
  article {
    background: var(--background-default-grey);
    padding: 3rem;
  }

  // header {}
  article {
    margin-top: 3rem;

    .gps-post__images {
      // display: grid;
      // grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      // grid-gap: 1rem;
      img {
        width: 100%;
      }
    }
  }
}

.fr-hr {
  padding-bottom: 2rem;
  margin-top: 2rem;
  max-width: 160px;

  &:last-child {
    display: none;
  }
}
</style>

<style lang="scss">
section.gps-post-actions {
  > div {
    position: sticky;
    top: 4rem;
  }
  button {
    width: 100%;
    justify-content: center;
  }
}
</style>