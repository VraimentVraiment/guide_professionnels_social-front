<script setup lang="ts">

const { fetchUser } = useDirectusAuth()

const { data: user, refresh } = await useAsyncData(async() => {
  return unref(await fetchUser())
})

const newUser = ref({ ...user.value })

const content = await queryContent('/pages/mon-espace').findOne()

const {
  isOpen: isModalOpen,
  open,
  close,
} = useModalModel('edit-user')

const goToResetPassword = () => {
  const params = new URLSearchParams()
  params.set('request_password_reset', 'true')
  params.set('mail', user.value?.email as string)
  navigateTo(`/auth?${params.toString()}`)
}

const updateUser = async() => {
  const token = useDirectusToken().token.value
  const url = useRuntimeConfig().public.directus.url
  const payload = useObjectDifference(user, newUser)
  await useUpdateDirectusSelfUser(url, token, payload)
  refresh()
  close()
}

</script>

<template>
  <div
    :class="[
      'fr-container-fluid'
    ]"
  >
    <div
      :class="[
        'div fr-grid-row',
        'fr-grid-row--gutters'
      ]"
    >
      <h1
        :class="[
          'fr-col-12',
        ]"
      >
        Mon espace
      </h1>

      <section
        :class="[
          'fr-col-12',
          'fr-col-sm-6'
        ]"
      >
        <h2>{{ content.personnalDataTitle }}</h2>
        <DsfrButton
          class="fr-mb-8v"
          :label="content.modifyPersonnalData"
          icon="ri-edit-line"
          icon-right
          type="button"
          @click="() => open()"
        />
        <DsfrModal
          :title="content.modalTitle"
          icon="ri-edit-line"
          :opened="isModalOpen"
          @close="() => close()"
        >
          <DsfrFieldset>
            <DsfrInputGroup
              v-model="newUser.first_name"
              label-visible
              :label="content.firstName"
              required
            />
            <DsfrInputGroup
              v-model="newUser.last_name"
              label-visible
              :label="content.lastName"
              required
            />
            <DsfrInputGroup
              v-model="newUser.structure"
              label-visible
              :label="content.structure"
            />
            <DsfrButton
              label="Enregistrer"
              icon="ri-check-line"
              icon-right
              type="button"
              @click="() => {
                updateUser()
                close()
              }"
            />
          </DsfrFieldset>
        </DsfrModal>
        <h3 class="fr-text--xl fr-mb-2v">
          Adresse mail
        </h3>
        <p>{{ user.email }}</p>
        <h3 class="fr-text--xl fr-mb-2v">
          {{ content.firstName }}
        </h3>
        <p>{{ user.first_name ?? content.notCommunicated }}</p>
        <h3 class="fr-text--xl fr-mb-2v">
          {{ content.lastName }}
        </h3>
        <p>{{ user.last_name ?? content.notCommunicated }}</p>
        <h3 class="fr-text--xl fr-mb-2v">
          {{ content.structure }}
        </h3>
        <p>{{ user.structure ?? content.notCommunicated }}</p>
      </section>
      <section
        :class="[
          'fr-col-12',
          'fr-col-sm-6'
        ]"
      >
        <h2>{{ content.modifyPasswordTitle }}</h2>
        <DsfrButton
          :label="content.modifyPassword"
          icon="ri-arrow-right-line"
          icon-right
          type="button"
          @click="() => goToResetPassword()"
        />
      </section>
    </div>
  </div>
</template>
