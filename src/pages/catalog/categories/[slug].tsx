import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from "next"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { client } from '@/lib/prismic'
import Link from 'next/link'
import PrismicDom from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'

interface CategoryProps {
    category: Document
    products: Document[]
}

const Modal = dynamic(
    () => import('@/components/Modal'),
    { loading: () => <p>Loading...</p>, ssr: false }
)

export default function Category({ category, products }: CategoryProps) {
    const router = useRouter()
    const [modalVisibility, setModalVisibility] = useState(false)

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    function handleModal() {
        setModalVisibility(!modalVisibility)
    }

    return (
        <div>
            <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>
            <ul>
                {products.map(prod => (
                    <li key={prod.id}>
                        <Link href={`/products/${prod.uid}`}>
                            <a>
                                {PrismicDom.RichText.asText(prod.data.title)}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>

            <button onClick={handleModal}>{modalVisibility ? 'Fechar' : 'Abrir'} modal</button>
            {modalVisibility && <Modal />}
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category'),
    ])

    const paths = categories.results.map(cat => {
        return {
            params: { slug: cat.uid }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params

    const category = await client().getByUID('category', String(slug), {})

    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)
    ])

    return {
        props: {
            category,
            products: products.results
        },
        revalidate: 15
    }
}
