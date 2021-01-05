import NextDocument, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () => {
        return originalRenderPage({
          enhanceApp: (App: any) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })
      }

      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>{/* todo: analytics */}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
