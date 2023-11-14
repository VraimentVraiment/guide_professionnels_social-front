<!-- eslint-disable camelcase -->
<script setup lang="ts">

/**
 * @todo do not hardcode this
 */
const IGNORE_PAGES = ['404', 'Plan du site', 'Connexion', 'Mon espace']
const LABEL_MAP = {
  '': 'Accueil',
  '/apropos': 'À propos',
  dispositifs: 'Dispositifs',
  fichestechniques: 'Fiches techniques',
  login: 'Connexion',
  monespace: 'Mon espace',
  apropos: 'À propos',
  contact: 'Contact',
  plandusite: 'Plan du site',
  accessibilite: 'Accessibilité',
  'donnees-personnelles': 'Données personnelles',
  'mentions-legales': 'Mentions légales',
  cookies: 'Gestion des cookies',
}

const result = await fetch('http://localhost:3000/sitemap.xml')
const xml = await result.text()

const getPages = () => {
  if (process.server) { return }
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const urls = doc.getElementsByTagName('url')
  const pages = Array.from(urls)
    .map((url) => {
      const loc = url.getElementsByTagName('loc')[0].textContent
      return { loc, label: formatLabel(loc) }
    })
    .filter(page => !IGNORE_PAGES.includes(page.label))

  return pages
}

function formatLabel(loc: string) {
  const split = loc.split('/')
  const label = split[split.length - 1]
  return LABEL_MAP[label] || label
}

</script>

<template>
  <div>
    <GpsPageTitle />
    <ul>
      <li
        v-for="page, i in getPages()"
        :key="i"
      >
        <a :href="(page.loc as string)">{{ page.label }}</a>
      </li>
    </ul>
  </div>
</template>
