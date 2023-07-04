import slugify from 'slugify'

const PRINT_OPTIONS = {
  margin: [15, 5],
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, letterRendering: true },
}

export async function useGpsPostDownload (
  contentSelector: string,
  pagebreak : {
    [key: string]: string
  },
) {
  const html2pdf = process.client && await import('html2pdf.js')

  const isGeneratingDownload = ref(false)

  const download = (filename: string) => {
    const printOptions = {
      ...PRINT_OPTIONS,
      filename: `${slugify(filename)}.pdf`,
      pagebreak,
    }

    const content = document.querySelector(contentSelector)

    isGeneratingDownload.value = true

    html2pdf.default(content, printOptions)
      .then(function () {
        isGeneratingDownload.value = false
      })
  }

  return {
    download,
    isGeneratingDownload,
  }
}
