<script setup lang="ts">

const content = await queryContent('/components/footer').findOne()

// const test = await useFetchDirectusItems({
//   collectionName: 'gps_site',
//   params: {
//     fields: [
//       'a11y_compliance',
//       'desc_text',
//       'licence_name',
//       'licence_text',
//       'licence_to',
//       'logo_text',
//       'operator_img_alt',
//       'operator_link_text',
//       'operator_to',
//     ],
//   },
// })

// const props = Object.assign({}, content.props, {
//   a11yCompliance: test?.a11y_compliance ?? content.props.a11yCompliance,
//   descText: test?.desc_text ?? content.props.descText,
//   licenceName: test?.licence_name ?? content.props.licenceName,
//   licenceText: test?.licence_text ?? content.props.licenceText,
//   licenceTo: test?.licence_to ?? content.props.licenceTo,
//   logoText: test?.logo_text?.split('\n') ?? content.props.logoText,
//   operatorImgAlt: test?.operator_img_alt ?? content.props.operatorImgAlt,
//   operatorLinkText: test?.operator_link_text ?? content.props.operatorLinkText,
//   operatorTo: test?.operator_to ?? content.props.operatorTo,
// })

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint'
    ]"
    v-bind="content.props"
  />
  <!-- v-bind="props" -->
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
