import SEO from '@/components/SEO'
import { GetServerSideProps } from 'next'
import { Title } from '../styles/pages/Home'

interface IProduct {
  id: string
  title: string
}

interface HomeProps {
  recommendedProducts: IProduct[]
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
            {product.title}
          </li>)
        })}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`)
  const recommendedProducts = await response.json()

  return {
    props: {
      recommendedProducts
    }
  }
}