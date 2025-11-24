import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Hook to fetch all active products
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'products'), where('active', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching products:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { products, loading, error };
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const unsubscribe = onSnapshot(doc(db, 'products', id), (doc) => {
            if (doc.exists()) {
                setProduct({ id: doc.id, ...doc.data() });
            } else {
                setError('Product not found');
            }
            setLoading(false);
        }, (err) => {
            console.error('Error fetching product:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    return { product, loading, error };
}

/**
 * Hook to fetch prices for a product
 */
export function usePrices(productId) {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const q = query(
            collection(db, 'prices'),
            where('productId', '==', productId),
            orderBy('price', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pricesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPrices(pricesList);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching prices:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [productId]);

    return { prices, loading, error };
}

/**
 * Hook to fetch all supermarkets
 */
export function useSupermarkets() {
    const [supermarkets, setSupermarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'supermarkets'), orderBy('name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const supermarketsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSupermarkets(supermarketsList);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching supermarkets:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { supermarkets, loading, error };
}
