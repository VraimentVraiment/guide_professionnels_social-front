<!-- eslint-disable camelcase -->
<script setup lang="ts">

const credentials = useDirectusUser()

const {
  first_name,
  email,
} = credentials?.value || {
  first_name: 'NON CONNECTÉ',
  email: 'NON CONNECTÉ',
}

</script>

<template>
  <div>
    <p>Bonjour {{ first_name }} !</p>
    <p>Vous êtes connecté avec l'adresse mail {{ email }}.</p>
  </div>
</template>
