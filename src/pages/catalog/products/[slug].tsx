import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from "next"
import dynamic from 'next/dynamic'
import { client } from '@/lib/prismic'
import { useRouter } from 'next/router'
import PrismicDom from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'

interface ProductProps {
    product: Document
}

export default function Product({ product }: ProductProps) {
    const router = useRouter()

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

            <div dangerouslySetInnerHTML={{ __html: PrismicDom.RichText.asHtml(product.data.description) }}></div>

            <p>Price: R${product.data.price}</p>

            <img src={product.data.thumbnail.url} width="600" alt="" />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
    const { slug } = context.params

    const product = await client().getByUID('product', String(slug), {})

    return {
        props: {
            product
        },
        revalidate: 15
    }
}
