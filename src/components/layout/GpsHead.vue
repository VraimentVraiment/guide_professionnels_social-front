<script lang="ts" setup>

defineProps<{
  title: string
  description: string
}>()

</script>

<template>
  <Html lang="fr">
    <Head>
      <Title>{{ title }}</Title>
      <Meta
        v-if="description"
        name="description"
        :content="description"
      />
    </Head>
  </Html>
</template>
