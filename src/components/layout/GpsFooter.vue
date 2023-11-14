<script setup lang="ts">

defineProps<{
  hasModalOntop?: boolean
}>()

const {
  props: contentProps,
} = await queryContent('/components/footer').findOne()

const directusProps = await useFetchDirectusItems({
  collectionName: 'gps_site_footer',
})

const footerProps = {
  licenceText: directusProps?.licence_text ?? contentProps?.licenceText ?? '',
  licenceTo: directusProps?.licence_to ?? contentProps?.licenceTo ?? '',
  licenceName: directusProps?.licence_name ?? contentProps?.licenceName ?? '',
  a11yCompliance: directusProps?.a11y_compliance ?? contentProps?.a11yCompliance ?? '',
  descText: directusProps?.desc_text ?? contentProps?.descText ?? '',
  logoText: directusProps?.logo_text?.split('\n') ?? contentProps?.logoText ?? '',
  operatorImgAlt: directusProps?.operator_img_alt ?? contentProps?.operatorImgAlt ?? '',
  operatorLinkText: directusProps?.operator_link_text ?? contentProps?.operatorLinkText ?? '',
  operatorTo: directusProps?.operator_to ?? contentProps?.operatorTo ?? '',

  homeLink: contentProps?.homeLink ?? '',
  legalLink: contentProps?.legalLink ?? '',
  personalDataLink: contentProps?.personalDataLink ?? '',
  cookiesLink: contentProps?.cookiesLink ?? '',
  a11yComplianceLink: contentProps?.a11yComplianceLink ?? '',
  afterMandatoryLinks: contentProps?.afterMandatoryLinks ?? '',
}

const { preferences } = useGpsScheme()
const operatorImgSrc = computed(() => {

  const directusOperatorImgSrc = preferences.theme === 'dark'
    ? directusProps?.operator_img_src_dark
    : directusProps?.operator_img_src

  const contentOperatorImgSrc = preferences.theme === 'dark'
    ? contentProps?.operatorImgSrcDark
    : contentProps?.operatorImgSrc

  return useGetDirectusFileLink(directusOperatorImgSrc, { isPublic: true })
    ?? contentOperatorImgSrc
    ?? ''
})

const { someModalOpen } = useSomeModalOpen()

</script>

<template>
  <DsfrFooter :class="[
    'gps-footer',
    'noprint',
    { 'has-modal-ontop': someModalOpen },
  ]" v-bind="{ operatorImgSrc, ...footerProps }" />
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
