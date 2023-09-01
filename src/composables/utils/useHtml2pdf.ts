import slugify from 'slugify'

const PRINT_OPTIONS = {
  margin: [15, 5],
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, letterRendering: true },
}

/**
 * An interface to use the html2pdf library to generate a PDF from a DOM element.
 */
export async function useHtml2pdf(
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
      .then(function() {
        isGeneratingDownload.value = false
      })
  }

  return {
    download,
    isGeneratingDownload,
  }
}
