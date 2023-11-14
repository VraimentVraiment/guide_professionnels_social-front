<script setup lang="ts">

const { preferences } = useGpsSchemeStore()

const directusProps = await useFetchDirectusItems({
  collectionName: 'gps_site_banner',
}) as unknown as {
  site_logo: string
  site_logo_dark: string
  service_title: string
  service_description: string
}

const logoPath = computed(() => {
  const operatorImgSrc = preferences.theme === 'dark'
    ? directusProps?.site_logo_dark
    : directusProps?.site_logo

  return useGetDirectusFileLink(operatorImgSrc, { isPublic: true }) ?? ''
})

const bannerTitle = directusProps?.service_title?.split('\n') ?? ''
const bannerDescription = directusProps?.service_description ?? ''

</script>

<template>
  <div
    :class="[
      'gps-banner',
      'fr-mb-6v'
    ]"
  >
    <div
      :class="[
        'gps-banner__logo',
        'fr-col-3',
        'fr-col-sm-4',
      ]"
    >
      <img
        :src="logoPath"
        alt="Logo GPS"
      >
    </div>
    <div
      :class="[
        'gps-banner__content',
        'fr-col-offset-sm-1',
        'fr-mb-2v'
      ]"
    >
      <h1
        :class="[
          'gps-banner__title',
          'fr-mb-2v'
        ]"
      >
        <span
          v-for="line, i in bannerTitle"
          :key="i"
          :class="[
            'gps-banner__title__line'
          ]"
        >
          {{ line }}
        </span>
      </h1>
      <p
        :class="[
          'gps-banner__baseline',
          'fr-text--lg'
        ]"
      >
        {{ bannerDescription }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gps-banner {
  @include dsfr.sm {
    display: flex;
    align-items: center;
  }

  .gps-banner__logo {
    @include dsfr.sm {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .gps-banner__content {
    .gps-banner__title {
      .gps-banner__title__line {
        display: block;

        &::first-letter {
          color: var(--blue-france-sun-113-625);
        }
      }
    }

    .gps-banner__baseline {
      margin-bottom: 0;
    }
  }

}
</style>
