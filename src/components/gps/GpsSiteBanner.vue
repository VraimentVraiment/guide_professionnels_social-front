<script setup lang="ts">

const content = await queryContent('/components/gps-site-banner').findOne()

</script>

<template>
  <div
    :class="[
      'gps-banner fr-mb-6v'
    ]"
  >
    <div
      :class="[
        'gps-banner__logo',
        'fr-col-3',
        'fr-col-sm-4'
      ]"
    >
      <img
        :src="content.logoPath"
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
          v-for="line, i in content.props.title"
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
        {{ content.props.baseline }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/';

.gps-banner {
  @include sm {
    display: flex;
    align-items: center;
  }

  .gps-banner__logo {
    @include sm {
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
      &--line {
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
