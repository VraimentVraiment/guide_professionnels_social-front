<script setup lang="ts">

const props = defineProps<{
  error: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
    description: string
    data: any
  }
}>()

const content = await queryContent('/pages/error').findOne()

const description = content[props?.error?.statusCode]?.description || content.errorDescription || ''

const handleError = () => clearError({ redirect: '/' })

</script>

<template>
  <div>
    <GpsHeader id="site-header" />
    <GpsMain id="site-main">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <h1 class="fr-title">
              Erreur {{ error?.statusCode }}
            </h1>
            <p v-if="description">
              {{ description }}
            </p>
            <DsfrButton
              :label="content.returnHomeLabel"
              icon="ri-arrow-left-line"
              tertiary
              no-outline
              @click="handleError"
            />
          </div>
        </div>
      </div>
    </GpsMain>
    <GpsFooter id="site-footer" />
  </div>
</template>
