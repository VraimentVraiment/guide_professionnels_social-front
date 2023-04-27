<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const credentials = useDirectusUser()

const {
  first_name,
  email,
}: {
  first_name: string
  mail: string
} = credentials.value

</script>

<template>
  <div>
    <p>Bonjour {{ first_name }} !</p>
    <p>Vous êtes connecté avec l'adresse mail {{ email }}.</p>
  </div>
</template>
