import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { productAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const LowStockProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLowStock = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await productAPI.getLowStockProducts();
				// Try common response shapes
				if (res && res.data) {
					if (Array.isArray(res.data.data)) {
						setProducts(res.data.data);
					} else if (Array.isArray(res.data)) {
						setProducts(res.data);
					} else if (res.data.products && Array.isArray(res.data.products)) {
						setProducts(res.data.products);
					} else {
						setProducts([]);
					}
				}
			} catch (err) {
				console.error('Error fetching low stock products:', err);
				setError('Failed to load low stock products. Please try again.');
				toast.error('Error loading low stock products');
			} finally {
				setLoading(false);
			}
		};

		fetchLowStock();
	}, []);

	const columns = [
		{ header: 'Product Name', accessor: 'name', sortable: true },
		{ header: 'SKU', accessor: 'sku', sortable: true },
		{ header: 'Category', accessor: 'category', sortable: true },
		{ header: 'Stock', accessor: 'stockQuantity', sortable: true },
		{ header: 'Reorder Level', accessor: 'reorderLevel', sortable: true },
		{ header: 'Price', accessor: 'price', cell: (row) => formatCurrency(row.price), sortable: true },
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return <Alert type="error" message={error} />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
					<ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
					Low Stock Products
				</h1>
				<Link to="/products">
					<Button type="button" variant="outline">
						<ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
						Back to Products
					</Button>
				</Link>
			</div>

			<Card>
				<div className="p-4 border-b">
					<p className="text-sm text-gray-600">
						Products with stock at or below their reorder level.
					</p>
				</div>
				<Table
					columns={columns}
					data={products}
					loading={false}
					emptyMessage="No low stock products found"
				/>
			</Card>
		</div>
	);
};

export default LowStockProducts;
