import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from "next"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

interface IProduct {
    id: string
    title: string
}

interface CategoryProps {
    products: IProduct[]
}

const Modal = dynamic(
    () => import('@/components/Modal'),
    { loading: () => <p>Loading...</p>, ssr: false }
)

export default function Product({ products }: CategoryProps) {
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
            <h1>Teste slug: {router.query.slug}</h1>
            <ul>
                {products.map(prod => (
                    <li key={prod.id}>{prod.title}</li>
                ))}
            </ul>

            <button onClick={handleModal}>{modalVisibility ? 'Fechar' : 'Abrir'} modal</button>
            {modalVisibility && <Modal />}
        </div>
    )
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const slug = context.params

    const response = await fetch(`http://localhost:3333/products?category_id=${slug}`)
    const products = await response.json()

    return {
        props: {
            products
        },
        revalidate: 15
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch(`http://localhost:3333/categories`)
    const categories = await response.json()

    const paths = categories.map(cat => {
        return {
            params: { slug: cat.id }
        }
    })

    return {
        paths,
        fallback: true
    }
}