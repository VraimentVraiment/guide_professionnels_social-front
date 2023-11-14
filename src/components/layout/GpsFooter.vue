<script setup lang="ts">

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

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint'
    ]"
    v-bind="footerProps"
  />
</template>

<style>
/*
 * Fix logo size
 * 'operatorImgStyle' footer prop sometimes gets overriden by the default style
 */
.gps-footer .fr-footer__logo {
  max-width: 21.5rem !important;
}
</style>

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
