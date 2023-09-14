<!-- eslint-disable camelcase -->
<script setup lang="ts">

const result = await fetch('http://localhost:3000/sitemap.xml')
const xml = await result.text()

const getPages = () => {
  if (process.server) { return }
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const urls = doc.getElementsByTagName('url')
  const pages = Array.from(urls).map((url) => {
    const loc = url.getElementsByTagName('loc')[0].textContent
    const lastmod = url.getElementsByTagName('lastmod')[0].textContent
    return { loc, lastmod }
  })

  return pages
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
        <a :href="(page.loc as string)">{{ page.loc }}</a>
      </li>
    </ul>
  </div>
</template>
