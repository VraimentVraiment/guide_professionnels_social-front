<script setup lang="ts">

const isAuthenticated = useIsAuthenticated()

const contentProps = await queryContent('/components/footer').findOne()

const directusProps = await useFetchDirectusItems({
  collectionName: 'gps_site_footer',
}) as unknown as {
  licence_text: string
  licence_to: string
  licence_name: string
  a11y_compliance: string
  desc_text: string
  logo_text: string
  operator_img_alt: string
  operator_link_text: string
  operator_to: string
  operator_img_src: string
  operator_img_src_dark: string
}

const footerProps = {
  licenceText: directusProps?.licence_text ?? '',
  licenceTo: directusProps?.licence_to ?? '#',
  licenceName: directusProps?.licence_name ?? '',
  a11yCompliance: directusProps?.a11y_compliance ?? '',
  descText: directusProps?.desc_text ?? '',
  logoText: directusProps?.logo_text?.split('\n') ?? '',
  operatorImgAlt: directusProps?.operator_img_alt ?? '',
  operatorLinkText: directusProps?.operator_link_text ?? '',
  operatorTo: directusProps?.operator_to ?? '',

  homeLink: contentProps?.homeLink ?? '',
  legalLink: contentProps?.legalLink ?? '',
  personalDataLink: contentProps?.personalDataLink ?? '',
  cookiesLink: contentProps?.cookiesLink ?? '',
  a11yComplianceLink: contentProps?.a11yComplianceLink ?? '',
}

const { preferences } = useGpsSchemeStore()

const operatorImgSrc = computed(() => {
  const directusOperatorImgSrc = preferences.theme === 'dark'
    ? directusProps?.operator_img_src_dark
    : directusProps?.operator_img_src

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

<style scoped>
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
}
</style>

<style>
/*
 * Fix logo size
 * 'operatorImgStyle' footer prop sometimes gets overriden by the default style
 */
.gps-footer .fr-footer__logo {
  max-width: 21.5rem !important;
}
</style>
