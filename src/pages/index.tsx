import SEO from '@/components/SEO'
import Link from 'next/link'
import { client } from '@/lib/prismic'
import { GetServerSideProps } from 'next'
import { Title } from '../styles/pages/Home'
import Prismic from 'prismic-javascript'
import PrismicDom from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'

interface HomeProps {
  recommendedProducts: Document[]
}

export default function Home({ recommendedProducts }: HomeProps) {

  return (
    <div>
      <SEO title="DevCommerce, o seu e-commerce top"
        image="caramba.png"
        shouldExcludeTitleSuffix />
      <Title>Products</Title>
      <ul>
        {recommendedProducts.map(product => {
          return (<li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>
                {PrismicDom.RichText.asText(product.data.title)}
              </a>
            </Link>
          </li>)
        })}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  return {
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }
}