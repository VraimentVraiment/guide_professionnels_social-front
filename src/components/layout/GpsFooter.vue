<script setup lang="ts">

const isAuthenticated = useIsAuthenticated()

const contentProps = await queryContent('/components/footer').findOne()

const {
  logoText,
} = useAppConfig()

const {
  data: directusProps,
} = useAsyncData(async() => {
  return await useFetchDirectusItems({
    collectionName: 'gps_site_footer',
  }) as unknown as {
        licence_text: string
        licence_to: string
        licence_name: string
        a11y_compliance: string
        desc_text: string
        operator_img_alt: string
        operator_link_text: string
        operator_to: string
        operator_img_src: string
        operator_img_src_dark: string
      }
})

const footerProps = computed(() => {
  return {
    licenceText: directusProps.value?.licence_text ?? '',
    licenceTo: directusProps.value?.licence_to ?? '#',
    licenceName: directusProps.value?.licence_name ?? '',
    a11yCompliance: directusProps.value?.a11y_compliance ?? '',
    descText: directusProps.value?.desc_text ?? '',
    operatorImgAlt: directusProps.value?.operator_img_alt ?? '',
    operatorLinkText: directusProps.value?.operator_link_text ?? '',
    operatorTo: directusProps.value?.operator_to ?? '',

    logoText,

    homeLink: contentProps?.homeLink ?? '',
    legalLink: contentProps?.legalLink ?? '',
    personalDataLink: contentProps?.personalDataLink ?? '',
    cookiesLink: contentProps?.cookiesLink ?? '',
    a11yComplianceLink: contentProps?.a11yComplianceLink ?? '',
  }
})

const { preferences } = useGpsSchemeStore()

const operatorImgSrc = computed(() => {
  const directusOperatorImgSrc = preferences.theme === 'dark'
    ? directusProps.value?.operator_img_src_dark
    : directusProps.value?.operator_img_src

  return useGetDirectusFileLink(directusOperatorImgSrc, { isPublic: true }) ?? ''
})

const afterMandatoryLinks = computed(() => {
  return contentProps?.afterMandatoryLinks
    ?.filter((link: {
      public: boolean
      label: string
      to: string
    }) => {
      return isAuthenticated.value || link.public
    }) ?? []
})

const { someModalOpen } = useSomeModalOpen()

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint',
      { 'has-modal-ontop': someModalOpen },
    ]"
    v-bind="{
      operatorImgSrc,
      afterMandatoryLinks,
      ...footerProps
    }"
  />
</template>

<style scoped lang="scss">
.gps-footer {
  background: var(--background-default-grey);

  /**
    * When some modal is open, we need to set the footer z-index to -1
    * to avoid the modal to be hidden by the footer
    * We cannot set z-index to -1 everywhere because it would prevent some
    * links in the footer from beeing clicked
   */
  &.has-modal-ontop {
    position: relative;
    z-index: -1;
  }

  /*
   * Fix logo size
   * 'operatorImgStyle' footer prop sometimes gets overriden by the default style
   */
  :deep(.fr-footer__logo) {
    max-width: 21.5rem !important;
  }
}
</style>
